export function Button({ children, asChild, ...props }) {
    return (
      <button className="px-4 py-2 text-white bg-blue-600 rounded" {...props}>
        {children}
      </button>
    );
  }
  