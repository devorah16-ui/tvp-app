import { logout } from "@/app/actions/logout";

export function Header() {
  return (
    <header className="flex justify-between items-center px-6 py-4">
      <div>Texas Vogue AI</div>

      <form action={logout}>
        <button
          type="submit"
          className="text-sm underline hover:opacity-70"
        >
          Logout
        </button>
      </form>
    </header>
  );
}