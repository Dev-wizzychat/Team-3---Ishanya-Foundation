from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Literal, ForwardRef
from enum import Enum
from datetime import datetime, date, timedelta
from pymongo import MongoClient
from pymongo.errors import PyMongoError
from bson import ObjectId
from jose import JWTError, jwt
from dotenv import load_dotenv
import bcrypt
import os
import traceback

# --------------------- Load Config ---------------------
load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY", "mysecret")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

# --------------------- Init FastAPI ---------------------
app = FastAPI(title="Ishanya Foundation Admin API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------- MongoDB Setup ---------------------
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
client = MongoClient(MONGO_URI)
db = client["iif_database"]
students_collection = db["students"]
educators_collection = db["educators"]
users_collection = db["users"]
programs_collection = db["programs"]
sessions_collection = db["sessions"]
assessments_collection = db["assessments"]
employees_collection = db["employees"]
# enrollments_collection = db["enrollment_forms"]


# --------------------- Enums ---------------------
class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"


class Status(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    ENDED = "ended"


class BloodGroup(str, Enum):
    A_POSITIVE = "A+"
    A_NEGATIVE = "A-"
    B_POSITIVE = "B+"
    B_NEGATIVE = "B-"
    O_POSITIVE = "O+"
    O_NEGATIVE = "O-"
    AB_POSITIVE = "AB+"
    AB_NEGATIVE = "AB-"


# --------------------- Utility ---------------------
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(plain_password, hashed_password) -> bool:
    return bcrypt.checkpw(plain_password.encode(), hashed_password.encode())


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# --------------------- Weekly Assessment ---------------------
# class WeeklyAssessment(BaseModel):
#     week: int
#     year: int
#     score: float
#     attendance_percentage: float
#     comments: Optional[str] = None


# class Performance(BaseModel):
#     weekly_assessments: List[WeeklyAssessment] = []
#     current_level: int = 1
#     attendance_percentage: float = 100.0
#     total_sessions_attended: int = 0
#     total_sessions: int = 0


# --------------------- ForwardRef Models ---------------------
EducatorRef = ForwardRef("Educator")
StudentRef = ForwardRef("Student")


class Educator(BaseModel):
    educator_id: str
    employee_id: str
    name: str
    photo_url: Optional[str] = None
    designation: str
    email: EmailStr
    date_of_birth: date
    phone: str
    department: str
    employment_type: str
    blood_group: BloodGroup
    program: List[str]  # ✅ multiple programs


class Student(BaseModel):
    student_id: str
    name: str
    photo_url: Optional[str] = None
    gender: Gender
    # date_of_birth: date
    primary_diagnosis: str
    comorbidity: Optional[str] = None
    enrollment_year: int
    status: Status
    email: EmailStr
    fathers_name: str
    mothers_name: str
    program: List[str]  # ✅ multiple programs
    educator_ids: List[str]  # ✅ multiple educators


class Session(BaseModel):
    session_id: Optional[str] = None
    date_timing: datetime
    duration: int
    program: str
    educator_id: str  # linked to educator


class Assessment(BaseModel):
    assessment_id: Optional[str] = None
    week: int
    year: int
    score: float
    attendance_percentage: float
    comments: Optional[str] = None
    program: str
    educator_id: str
    student_id: str


class Employee(BaseModel):
    employee_id: str
    name: str
    gender: Gender
    photo_url: Optional[str] = None
    designation: str
    department: str
    employment_type: str
    program: str
    email: EmailStr
    phone: str
    date_of_birth: date
    date_of_joining: date
    status: Status
    tenure: Optional[int] = None
    work_location: Optional[str] = None
    emergency_contact_number: str
    blood_group: BloodGroup


# --------------------- Enrollment Form ---------------------
class EnrollmentForm(BaseModel):
    student_name: str
    date_of_birth: date
    gender: Gender
    ud_id: Optional[str] = None
    primary_diagnosis: str
    comorbidity: Optional[str] = None
    fathers_name: str
    mothers_name: str
    contact_number: str
    email: EmailStr
    address: str
    blood_group: Optional[BloodGroup] = None
    preferred_program: Optional[str] = None
    previous_therapy_experience: Optional[str] = None
    emergency_contact: str
    emergency_contact_relation: str
    documents_submitted: List[str] = []
    application_date: datetime = Field(default_factory=datetime.utcnow)
    status: Literal["pending", "approved", "rejected"] = "pending"


# --------------------- Auth Models ---------------------
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    role: Literal["student", "educator", "admin"]
    profile_id: str


class Token(BaseModel):
    access_token: str
    token_type: str


# --------------------- Finalize forward refs ---------------------
Student.update_forward_refs()
Educator.update_forward_refs()


# --------------------- OAuth2 & Auth Helpers ---------------------
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        user = users_collection.find_one({"email": email})
        if user is None:
            raise credentials_exception
        return user
    except JWTError:
        raise credentials_exception


async def get_admin_user(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


def serialize(doc):
    doc["id"] = str(doc["_id"])
    doc.pop("_id", None)
    return doc


# --------------------- Auth Routes ---------------------
@app.post("/register")
async def register_user(user: UserRegister):
    existing = users_collection.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_pw = hash_password(user.password)
    users_collection.insert_one(
        {
            "email": user.email,
            "password": hashed_pw,
            "role": user.role,
            "profile_id": user.profile_id,
        }
    )

    return {"message": "User registered successfully"}


@app.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = users_collection.find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Create token
    token_data = {"sub": user["email"], "role": user["role"]}
    access_token = create_access_token(data=token_data)

    # Fetch full profile using role + profile_id
    profile = None
    if user["role"] == "educator":
        profile = educators_collection.find_one({"educator_id": user["profile_id"]})
    elif user["role"] == "student":
        profile = students_collection.find_one({"student_id": user["profile_id"]})
    elif user["role"] == "admin":
        profile = employees_collection.find_one({"employee_id": user["profile_id"]})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user["role"],
        "profile": serialize(profile) if profile else None,
    }


@app.get("/protected")
async def protected_route(current_user: dict = Depends(get_current_user)):
    return {
        "message": f"Hello, {current_user['email']}! You are a {current_user['role']}"
    }


# --------------------- Public Routes ---------------------
@app.get("/")
def homepage():
    return {"message": "Welcome to Ishanya Foundation"}


@app.get("/faqs")
def get_faqs():
    return {
        "faqs": [
            {
                "question": "What programs do you offer?",
                "answer": "We offer various skill development programs...",
            },
        ]
    }


# --------------------- Dashboards ---------------------
# -------------------- Add Student API --------------------
@app.post("/add-student/")
async def add_student(student: Student):
    student_data = student.dict(by_alias=True, exclude_none=True)

    # Check if student already exists
    if students_collection.find_one({"student_id": student.student_id}):
        raise HTTPException(status_code=400, detail="Student already exists")

    students_collection.insert_one(student_data)
    return {"message": "Student added successfully"}


# -------------------- View Student API --------------------
@app.get("/view-student/{student_id}")
async def view_student(student_id: str):
    student = students_collection.find_one(
        {"student_id": student_id}, {"_id": 0}
    )  # Exclude MongoDB `_id`
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student


# -------------------- Update Student API --------------------
@app.put("/update-student/{student_id}")
async def update_student(student_id: str, updated_data: Student):
    update_data = updated_data.dict(by_alias=True, exclude_none=True)
    result = students_collection.update_one(
        {"student_id": student_id}, {"$set": update_data}
    )

    if result.modified_count == 0:
        raise HTTPException(
            status_code=404, detail="Student not found or no changes made"
        )

    return {"message": "Student updated successfully"}


# @app.get("/employee-dashboard/{employee_id}")
# async def employee_dashboard(employee_id: str):
#     educator = educators_collection.find_one({"employee_id": employee_id})
#     if not educator:
#         raise HTTPException(status_code=404, detail="Employee not found")
#     return serialize(educator)


@app.get("/educator-dashboard")
async def educator_dashboard(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "educator":
        raise HTTPException(status_code=403, detail="Educator access required")

    educator = educators_collection.find_one({"email": current_user["email"]})
    if not educator:
        raise HTTPException(status_code=404, detail="Educator not found")

    employee = employees_collection.find_one({"employee_id": educator["employee_id"]})
    if not employee:
        raise HTTPException(status_code=404, detail="Employee record not found")

    return {
        "name": educator["name"],
        "employee_id": educator["employee_id"],
        "photo_url": educator.get("photo_url"),
        "designation": educator["designation"],
        "email": educator["email"],
        "department": educator["department"],
        "phone": educator["phone"],
        "date_of_joining": employee.get("date_of_joining"),
        "program": educator.get("program", []),
    }


# --------------------- Enrollment Form Submission ---------------------
# @app.post("/enrollment-form", response_model=dict)
# async def submit_enrollment_form(enrollment: EnrollmentForm):
#     if enrollment.date_of_birth > date.today():
#         raise HTTPException(status_code=400, detail="Invalid date of birth")
#     result = enrollments_collection.insert_one(enrollment.dict())
#     return {
#         "message": "Enrollment form submitted successfully",
#         "enrollment_id": str(result.inserted_id),
#         "status": "pending",
#     }

# # --------------------- Admin: Students ---------------------
# @app.post("/admin/students/", response_model=dict)
# async def add_student(student: Student, admin: dict = Depends(get_admin_user)):
#     result = students_collection.insert_one(student.dict())
#     return {"id": str(result.inserted_id)}

# @app.get("/admin/students/", response_model=List[dict])
# async def view_all_students(admin: dict = Depends(get_admin_user)):
#     return [serialize(s) for s in students_collection.find()]

# @app.get("/admin/students/{student_id}", response_model=dict)
# async def view_student_details(student_id: str, admin: dict = Depends(get_admin_user)):
#     student = students_collection.find_one({"_id": ObjectId(student_id)})
#     if not student:
#         raise HTTPException(status_code=404, detail="Student not found")
#     return serialize(student)

# @app.put("/admin/students/{student_id}", response_model=dict)
# async def update_student(student_id: str, student: Student, admin: dict = Depends(get_admin_user)):
#     result = students_collection.update_one({"_id": ObjectId(student_id)}, {"$set": student.dict()})
#     if result.matched_count == 0:
#         raise HTTPException(status_code=404, detail="Student not found")
#     return {"message": "Student updated successfully"}

# @app.delete("/admin/students/{student_id}", response_model=dict)
# async def delete_student(student_id: str, admin: dict = Depends(get_admin_user)):
#     result = students_collection.delete_one({"_id": ObjectId(student_id)})
#     if result.deleted_count == 0:
#         raise HTTPException(status_code=404, detail="Student not found")
#     return {"message": "Student deleted successfully"}

# # --------------------- Admin: Programs ---------------------
# @app.post("/admin/programs/", response_model=dict)
# async def add_program(program: Program, admin: dict = Depends(get_admin_user)):
#     result = programs_collection.insert_one(program.dict())
#     return {"id": str(result.inserted_id)}

# @app.get("/admin/programs/", response_model=List[dict])
# async def view_all_programs(admin: dict = Depends(get_admin_user)):
#     return [serialize(p) for p in programs_collection.find()]

# @app.put("/admin/programs/{program_id}", response_model=dict)
# async def update_program(program_id: str, program: Program, admin: dict = Depends(get_admin_user)):
#     result = programs_collection.update_one({"_id": ObjectId(program_id)}, {"$set": program.dict()})
#     if result.matched_count == 0:
#         raise HTTPException(status_code=404, detail="Program not found")
#     return {"message": "Program updated successfully"}

# @app.delete("/admin/programs/{program_id}", response_model=dict)
# async def delete_program(program_id: str, admin: dict = Depends(get_admin_user)):
#     result = programs_collection.delete_one({"_id": ObjectId(program_id)})
#     if result.deleted_count == 0:
#         raise HTTPException(status_code=404, detail="Program not found")
#     return {"message": "Program deleted successfully"}

# # --------------------- Admin: Employees ---------------------
# @app.post("/admin/employees/", response_model=dict)
# async def add_employee(educator: Educator, admin: dict = Depends(get_admin_user)):
#     result = educators_collection.insert_one(educator.dict())
#     return {"id": str(result.inserted_id)}

# @app.get("/admin/employees/", response_model=List[dict])
# async def view_all_employees(admin: dict = Depends(get_admin_user)):
#     return [serialize(e) for e in educators_collection.find()]

# @app.get("/admin/employees/{employee_id}", response_model=dict)
# async def view_employee_details(employee_id: str, admin: dict = Depends(get_admin_user)):
#     educator = educators_collection.find_one({"_id": ObjectId(employee_id)})
#     if not educator:
#         raise HTTPException(status_code=404, detail="Employee not found")
#     return serialize(educator)

# @app.put("/admin/employees/{employee_id}", response_model=dict)
# async def update_employee(employee_id: str, educator: Educator, admin: dict = Depends(get_admin_user)):
#     result = educators_collection.update_one({"_id": ObjectId(employee_id)}, {"$set": educator.dict()})
#     if result.matched_count == 0:
#         raise HTTPException(status_code=404, detail="Employee not found")
#     return {"message": "Employee updated successfully"}

# @app.delete("/admin/employees/{employee_id}", response_model=dict)
# async def delete_employee(employee_id: str, admin: dict = Depends(get_admin_user)):
#     result = educators_collection.delete_one({"_id": ObjectId(employee_id)})
#     if result.deleted_count == 0:
#         raise HTTPException(status_code=404, detail="Employee not found")
#     return {"message": "Employee deleted successfully"}

# # --------------------- Admin: Sessions ---------------------
# @app.post("/admin/sessions/", response_model=dict)
# async def add_session(session: SessionCreate, admin: dict = Depends(get_admin_user)):
#     result = sessions_collection.insert_one(session.dict())
#     return {"id": str(result.inserted_id)}

# @app.get("/admin/sessions/", response_model=List[dict])
# async def view_all_sessions(admin: dict = Depends(get_admin_user)):
#     return [serialize(s) for s in sessions_collection.find()]

# @app.put("/admin/sessions/{session_id}", response_model=dict)
# async def update_session(session_id: str, session: SessionCreate, admin: dict = Depends(get_admin_user)):
#     result = sessions_collection.update_one({"_id": ObjectId(session_id)}, {"$set": session.dict()})
#     if result.matched_count == 0:
#         raise HTTPException(status_code=404, detail="Session not found")
#     return {"message": "Session updated successfully"}

# @app.delete("/admin/sessions/{session_id}", response_model=dict)
# async def delete_session(session_id: str, admin: dict = Depends(get_admin_user)):
#     result = sessions_collection.delete_one({"_id": ObjectId(session_id)})
#     if result.deleted_count == 0:
#         raise HTTPException(status_code=404, detail="Session not found")
#     return {"message": "Session deleted successfully"}

# # --------------------- Admin: Stakeholder Directory ---------------------
# @app.get("/admin/stakeholder-directory")
# async def view_stakeholder_directory(admin: dict = Depends(get_admin_user)):
#     students = [serialize(s) for s in students_collection.find()]
#     educators = [serialize(e) for e in educators_collection.find()]
#     programs = [serialize(p) for p in programs_collection.find()]
#     return {
#         "students": students,
#         "educators": educators,
#         "programs": programs,
#         "total_students": len(students),
#         "total_educators": len(educators),
#         "total_programs": len(programs),
#     }

# # --------------------- Admin: Enrollment Form Processing ---------------------
# @app.get("/admin/enrollment-forms", response_model=List[EnrollmentForm])
# async def view_enrollment_forms(status: Optional[str] = None, admin: dict = Depends(get_admin_user)):
#     query = {}
#     if status:
#         if status not in ["pending", "approved", "rejected"]:
#             raise HTTPException(status_code=400, detail="Invalid status")
#         query["status"] = status
#     forms = [serialize(f) for f in enrollments_collection.find(query)]
#     return forms

# @app.put("/admin/enrollment-forms/{form_id}", response_model=dict)
# async def process_enrollment_form(
#     form_id: str,
#     status: Literal["approved", "rejected"],
#     admin: dict = Depends(get_admin_user),
# ):
#     form = enrollments_collection.find_one({"_id": ObjectId(form_id)})
#     if not form:
#         raise HTTPException(status_code=404, detail="Enrollment form not found")

#     enrollments_collection.update_one(
#         {"_id": ObjectId(form_id)}, {"$set": {"status": status}}
#     )

#     if status == "approved":
#         student_data = {
#             "name": form["student_name"],
#             "date_of_birth": form["date_of_birth"],
#             "gender": form["gender"],
#             "ud_id": form.get("ud_id", ""),
#             "primary_diagnosis": form["primary_diagnosis"],
#             "comorbidity": form.get("comorbidity"),
#             "email": form["email"],
#             "fathers_name": form["fathers_name"],
#             "mothers_name": form["mothers_name"],
#             "blood_group": form.get("blood_group", BloodGroup.O_POSITIVE),
#             "program": form.get("preferred_program", "General"),
#             "enrollment_year": datetime.utcnow().year,
#             "status": Status.ACTIVE,
#             "student_id": f"STU{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
#             "performance": Performance().dict(),
#         }

#         students_collection.insert_one(student_data)
#         return {
#             "message": "Enrollment form approved and student record created",
#             "student_id": student_data["student_id"],
#         }

#     return {"message": f"Enrollment form {status}", "form_id": form_id}
