# Academic Records System (Assignment)

This project contains two parts:
1. **Web Demo**: A React-based simulation running in this browser.
2. **Desktop Application**: A Python/Tkinter + MySQL application code for your assignment submission.

## How to Run the Desktop App (For Assignment)

The file `desktop_app.py` contains the complete source code required for your assignment "Python (Tkinter) as GUI and MySQL as backend".

### Prerequisites
1.  **Python** installed on your local machine.
2.  **MySQL Server** installed and running.
3.  Python libraries:
    ```bash
    pip install mysql-connector-python
    ```

### Setup Database
1.  Open your MySQL Workbench or Command Line.
2.  Copy the content of `schema.sql`.
3.  Run the SQL script to create the `school_db` database and tables.

### Configure Application
1.  Open `desktop_app.py` in a text editor.
2.  Find the `DB_CONFIG` dictionary near the top.
3.  Update the `'user'` and `'password'` fields to match your local MySQL credentials.

### Run
Run the application using:
```bash
python desktop_app.py
```

## Features Implemented
*   **GUI**: Built with Tkinter (Tabbed interface).
*   **Database**: MySQL Integration.
*   **Real-time**: Tables auto-refresh after add/update/delete.
*   **Export**: "Export Report (CSV)" button in the Enrollments tab.
*   **Tables**: Students, Courses, Enrollments (Related tables).
