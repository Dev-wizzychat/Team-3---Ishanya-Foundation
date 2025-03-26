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
    id: str
    name: str
    role: str
    email: EmailStr
    dob: str
    phone: str
    course_id: str
    joinDate: str
    address: str


class Student(BaseModel):
    student_id: str
    name: str
    gender: str
    father_name: str
    mother_name: str
    student_email: EmailStr
    parent_email: EmailStr
    contact_number: str
    alt_contact_number: str
    address: str
    pincode: str
    dob: str
    course_id: str
    blood_group: Optional[str] = None
    comorbidity: Optional[str] = None
    udid: Optional[str] = None
    diagnosis: str
    allergies: Optional[str] = None
    days_attending: List[str] = []
    available_from: Optional[str] = None  # Assuming HH:MM format
    available_until: Optional[str] = None
    examResult: List[dict] = []
    attendence: List[dict] = []


class Session(BaseModel):
    session_id: str
    name: str
    date_timing: datetime
    duration: int
    course_id: str


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
    date_of_birth: str
    date_of_joining: str
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


class Course(BaseModel):
    course_id: str  # Unique identifier for the course
    name: str  # Name of the course
    description: str
    duration: int  # Duration of the course in hours
    educator_enrolled: List[str] = []  # ID of the educator teaching the course
    students_enrolled: List[str] = []  # List of student IDs enrolled in the course
    start_date: str  # Start date of the course


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
async def login(form_data: dict):
    # Extract username and password from the JSON body
    username = form_data.get("username")
    password = form_data.get("password")
    
    if not username or not password:
        raise HTTPException(status_code=400, detail="Username and password are required")

    # Find user by email (username in the request)
    user = users_collection.find_one({"email": username})
    if not user or not verify_password(password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create token
    token_data = {"sub": user["email"], "role": user["role"]}
    access_token = create_access_token(data=token_data)
    # print(token_data)
    # Fetch full profile
    # print(access_token)
    profile = None
    profile_id = None  # This will store either educator_id, student_id, or employee_id

    if user["role"] == 'educator':
        # print()
        profile = educators_collection.find_one({"id": user["profile_id"]})
        # print(profile)
        profile_id = profile["id"] if profile else None
    elif user["role"] == "student":
        profile = students_collection.find_one({"student_id": user["profile_id"]})
        profile_id = profile["student_id"] if profile else None
    elif user["role"] == "admin":
        profile = employees_collection.find_one({"employee_id": user["profile_id"]})
        profile_id = profile["employee_id"] if profile else None

    # Prepare response data
    
    response_data = {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user["role"],
        "profile": serialize(profile) if profile else None,
        "profile_id": profile_id,  # Include the ID in the response
    }
    print("one")
    print(response_data)
    return response_data

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


@app.post("/add-session/")
async def add_session(session: Session):
    try:
        # Check if the session already exists
        existing_session = sessions_collection.find_one(
            {"session_id": session.session_id}
        )
        if existing_session:
            raise HTTPException(
                status_code=400, detail="Session with this ID already exists"
            )

        # Insert the session into the database
        session_data = session.dict()
        sessions_collection.insert_one(session_data)
        return {
            "message": "Session added successfully",
            "session_id": session.session_id,
        }
    except PyMongoError as e:
        # Handle database-related errors
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Database error occurred")
    except Exception as e:
        # Handle unexpected errors
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="An unexpected error occurred")


@app.get("/view-session/{session_id}")
async def view_session(session_id: str):
    session = sessions_collection.find_one(
        {"session_id": session_id}, {"_id": 0}
    )  # Exclude MongoDB `_id`
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@app.get("/student-count/")
async def get_student_count():
    try:
        # Count the number of students in the collection
        student_count = students_collection.count_documents({})
        return {"student_count": student_count}
    except PyMongoError as e:
        # Handle database-related errors
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Database error occurred")
    except Exception as e:
        # Handle unexpected errors
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="An unexpected error occurred")
    

@app.get("/educator-count/")
async def get_student_count():
    try:
        # Count the number of students in the collection
        student_count = educators_collection.count_documents({})
        return {"student_count": student_count}
    except PyMongoError as e:
        # Handle database-related errors
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Database error occurred")
    except Exception as e:
        # Handle unexpected errors
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="An unexpected error occurred")
    

@app.get("/all-sessions/")
async def view_all_sessions():
    sessions = sessions_collection.find()  # Fetch all sessions from the database
    session_list = []

    for session in sessions:
        session["_id"] = str(session["_id"])  # Convert ObjectId to string
        session_list.append(session)

    if not session_list:
        raise HTTPException(status_code=404, detail="No sessions found")

    return session_list


@app.post("/add-course/")
async def add_course(course: Course):
    try:
        # Check if the course already exists
        existing_course = programs_collection.find_one({"course_id": course.course_id})
        if existing_course:
            raise HTTPException(
                status_code=400, detail="Course with this ID already exists"
            )

        # Insert the course into the database
        course_data = course.dict()
        print("Check1")
        programs_collection.insert_one(course_data)
        print("Check2")
        return {"message": "Course added successfully", "course_id": course.course_id}
    except PyMongoError as e:
        # Handle database-related errors
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Database error occurred")
    except Exception as e:
        # Handle unexpected errors
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="An unexpected error occurred")

class AttendanceRequest(BaseModel):
    student_id: str
    session_id: str
    status: Literal["present", "absent"]

@app.post("/mark-session-attendance/")
async def mark_session_attendance(request: AttendanceRequest):
    student_id = request.student_id
    session_id = request.session_id
    status = request.status
    # Find the student by student_id
    print(student_id)
    student = students_collection.find_one({"student_id": student_id})
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # Find the session by session_id
    session = sessions_collection.find_one({"session_id": session_id})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # Check if attendance for the given session already exists
    existing_attendance = next(
        (
            record
            for record in student.get("attendence", [])
            if record["session_id"] == session_id
        ),
        None,
    )
    if existing_attendance:
        # Update the existing attendance record
        existing_attendance["status"] = status
        students_collection.update_one(
            {"student_id": student_id}, {"$set": {"attendence": student["attendence"]}}
        )
    else:
        # Add a new attendance record
        new_attendance = {"session_id": session_id, "status": status}
        students_collection.update_one(
            {"student_id": student_id}, {"$push": {"attendence": new_attendance}}
        )

    return {
        "message": f"Attendance for session {session_id} marked as {status} for student {student_id}"
    }


# from pydantic import BaseModel

class AssessmentRequest(BaseModel):
    student_id: str
    session_id: str
    marks_obtained: float

@app.post("/mark-assessment/")
async def mark_assessment(request: AssessmentRequest):
    student_id = request.student_id
    session_id = request.session_id
    marks_obtained = request.marks_obtained

    # Find the student by student_id
    student = students_collection.find_one({"student_id": student_id})
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # Find the session by session_id
    session = sessions_collection.find_one({"session_id": session_id})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # Check if an assessment for the given session already exists
    existing_assessment = next(
        (
            record
            for record in student.get("examResult", [])
            if record["session_id"] == session_id
        ),
        None,
    )
    if existing_assessment:
        # Update the existing assessment record
        existing_assessment["marks_obtained"] = marks_obtained
        students_collection.update_one(
            {"student_id": student_id}, {"$set": {"examResult": student["examResult"]}}
        )
    else:
        # Add a new assessment record
        new_assessment = {"session_id": session_id, "marks_obtained": marks_obtained}
        students_collection.update_one(
            {"student_id": student_id}, {"$push": {"examResult": new_assessment}}
        )

    return {
        "message": f"Assessment for session {session_id} marked with {marks_obtained} marks for student {student_id}"
    }


@app.get("/all-courses/")
async def view_all_courses():
    courses = programs_collection.find()  # Fetch all courses from the database
    course_list = []

    for course in courses:
        course["_id"] = str(course["_id"])  # Convert ObjectId to string
        course_list.append(course)

    if not course_list:
        raise HTTPException(status_code=404, detail="No courses found")

    return course_list


@app.get("/students-in-course/{course_id}")
async def get_students_in_course(course_id: str):
    # Find the course by course_id
    course = programs_collection.find_one({"course_id": course_id}, {"_id": 0})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    # Fetch students enrolled in the course
    students = students_collection.find({"course_id": course_id}, {"_id": 0})
    student_list = list(students)

    if not student_list:
        raise HTTPException(
            status_code=404, detail="No students enrolled in this course"
        )

    return student_list


# -------------------- View Student API --------------------
@app.get("/view-student/{student_id}")
async def view_student(student_id: str):
    # First get the student data
    student = students_collection.find_one({"student_id": student_id}, {"_id": 0})
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # If student has exam results, populate session data for each
    if "examResult" in student and student["examResult"]:
        exam_results = []
        for result in student["examResult"]:
            if "session_id" in result:
                session = sessions_collection.find_one(
                    {"session_id": result["session_id"]}, {"_id": 0}
                )
                if session:
                    populated_result = result.copy()
                    populated_result["session"] = session
                    exam_results.append(populated_result)
                else:
                    exam_results.append(result)
            else:
                exam_results.append(result)
        student["examResult"] = exam_results

    if "attendence" in student and student["attendence"]:
        attendance_records = []
        for record in student["attendence"]:
            if "session_id" in record:
                session = sessions_collection.find_one(
                    {"session_id": record["session_id"]}, {"_id": 0}
                )
                if session:
                    populated_record = record.copy()
                    populated_record["session"] = session
                    attendance_records.append(populated_record)
                else:
                    attendance_records.append(record)
            else:
                attendance_records.append(record)
        student["attendence"] = attendance_records

    return student

@app.get("/view-educator/{id}")
async def view_educator(id: str):
    
    educator = educators_collection.find_one({"id": id}, {"_id": 0})  # Exclude MongoDB `_id`
    if not educator:
        raise HTTPException(status_code=404, detail="Educator not found")

    return educator

@app.get("/view-course/{course_id}")
async def view_student(course_id: str):
    student = programs_collection.find_one(
        {"course_id": course_id}, {"_id": 0}
    )  # Exclude MongoDB `_id`
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student


@app.put("/update-course/{course_id}")
async def update_course(course_id: str, updated_data: Course):
    # Convert the updated data to a dictionary, excluding unset fields
    update_data = updated_data.dict(exclude_unset=True)

    # Update the course in the database
    result = programs_collection.update_one(
        {"course_id": course_id}, {"$set": update_data}
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404, detail="Course not found or no changes made"
        )

    return {"message": "Course updated successfully"}


@app.delete("/delete-course/{course_id}")
async def delete_course(course_id: str):
    # Delete the course from the database
    result = programs_collection.delete_one({"course_id": course_id})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Course not found")

    return {"message": "Course deleted successfully"}


# -------------------- Update Student API --------------------
# @app.put("/update-student/{student_id}")
# async def update_student(student_id: str, updated_data: Student):
#     # Convert the updated data to a dictionary, excluding unset fields
#     update_data = updated_data.dict(exclude_unset=True, by_alias=True)

#     # Update the student in the database
#     result = students_collection.update_one(
#         {"student_id": student_id},
#         {"$set": update_data}
#     )

#     if result.matched_count == 0:
#         raise HTTPException(
#             status_code=404,
#             detail="Student not found"
#         )

#     if result.modified_count == 0:
#         return {"message": "No changes made to student data"}

#     return {"message": "Student updated successfully"}


@app.put("/update-student/{student_id}")
async def update_student(student_id: str, updated_data: Student):
    existing_student = students_collection.find_one({"student_id": student_id})

    if not existing_student:
        raise HTTPException(status_code=404, detail="Student not found")

    # Merge existing data with updated data
    updated_student = {**existing_student, **updated_data.dict(exclude_unset=True)}

    # Ensure student_id remains the same
    updated_student["student_id"] = student_id

    # Update the record in the database
    result = students_collection.replace_one(
        {"student_id": student_id}, updated_student
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Student not found")

    return {"message": "Student updated successfully"}


@app.put("/update-educator/{id}")
async def update_educator(id: str, updated_data: Educator):
    update_data = updated_data.dict(by_alias=True, exclude_none=True)
    result = educators_collection.update_one({"id": id}, {"$set": update_data})

    if result.modified_count == 0:
        raise HTTPException(
            status_code=404, detail="Student not found or no changes made"
        )

    return {"message": "Student updated successfully"}


@app.post("/add-educator/")
async def add_educator(educator: Educator):
    existing_educator = educators_collection.find_one({"id": educator.id})
    if existing_educator:
        raise HTTPException(
            status_code=400, detail="Educator with this ID already exists"
        )

    educator_data = educator.dict()
    educators_collection.insert_one(educator_data)
    return {
        "message": "Educator added successfully",
        "id": educator.id,
    }


@app.get("/educator-dashboard/")
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


@app.get("/all-students")
async def view_student():
    students = students_collection.find()
    student_list = []

    for student in students:
        student["_id"] = str(student["_id"])  # Convert ObjectId to string
        student_list.append(student)

    if not student_list:
        raise HTTPException(status_code=404, detail="No Students Found")

    return student_list


@app.get("/all-educators")
async def view_educator():
    educator = educators_collection.find()
    educator_list = []

    for student in educator:
        if student.get("role") == "Educator":  # Check if the role is 'educator'
            student["_id"] = str(student["_id"])  # Convert ObjectId to string
            educator_list.append(student)

    if not educator_list:
        raise HTTPException(status_code=404, detail="No Students Found")

    return educator_list
