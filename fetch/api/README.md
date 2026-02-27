# Simple PHP API Backend

Each route is a separate PHP file. Call the file URL directly.

## Routes

| Method | File                   | URL                          | Description                    |
|--------|------------------------|------------------------------|--------------------------------|
| POST   | `login.php`            | `/login.php`                 | Login with username & password |
| GET    | `student-list.php`     | `/student-list.php`          | Get list of students           |
| POST   | `student-information.php` | `/student-information.php` | Add a new student              |

## Setup with XAMPP

1. Copy this `api` folder into your XAMPP **htdocs** directory (e.g. `C:\xampp\htdocs\api`).
2. Start **Apache** from the XAMPP Control Panel.
3. Open in browser: `http://localhost/api/` (or `http://localhost/api` if you named the folder `api`).

Base URL: `http://localhost/api` (adjust if you used a different folder name, e.g. `http://localhost/alingasa-marvin-activities/api`).

## Examples

**POST login** → `http://localhost/api/login.php` (JSON body):
```json
{ "username": "admin", "password": "admin123" }
```

**GET student-list** → `http://localhost/api/student-list.php`

**POST student-information** → `http://localhost/api/student-information.php` (JSON body):
```json
{
  "student_id": "2024-006",
  "first_name": "Marvin",
  "last_name": "Alingasa",
  "email": "marvin@school.edu",
  "course": "BS IT",
  "year_level": 2
}
```

## Structure

- `index.php` – API info (lists route URLs)
- `login.php` – POST login route
- `student-list.php` – GET student list route
- `student-information.php` – POST add student route
- `includes/helpers.php` – shared helpers (sendJson, loadJson, saveJson)
- `data/users.json` – dummy users for login
- `data/students.json` – dummy student list
