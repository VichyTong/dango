import sqlite3
import json
import uuid

from utils.log import log_text


con = sqlite3.connect("clean.db")

cur = con.cursor()

cur.execute(
    """
CREATE TABLE IF NOT EXISTS histories (
    client_id TEXT PRIMARY KEY,
    history TEXT
)
"""
)

cur.execute(
    """
CREATE TABLE IF NOT EXISTS sheets (
    client_id TEXT,
    sheet_id TEXT,
    version INTEGER,
    data TEXT,
    PRIMARY KEY (client_id, sheet_id, version)
)
"""
)

cur.execute(
    """
CREATE TABLE IF NOT EXISTS sheets_buffer (
    client_id TEXT,
    sheet_id TEXT,
    data TEXT,
    PRIMARY KEY (client_id, sheet_id)
)
"""
)

cur.execute(
    """
CREATE TABLE IF NOT EXISTS client_statistics (
    client_id TEXT PRIMARY KEY,
    start_timestamp TEXT,
    end_timestamp TEXT,
    verification_attempts INTEGER
);
"""
)

cur.execute(
    """
CREATE TABLE IF NOT EXISTS DSL_functions (
    client_id TEXT PRIMARY KEY,
    functions TEXT
);
"""
)


def upload_sheet(client_id, sheet_id, version, data):
    data = json.dumps(data)
    cur.execute(
        "INSERT INTO sheets (client_id, sheet_id, version, data) VALUES (?, ?, ?, ?)",
        (client_id, sheet_id, version, data),
    )
    con.commit()


def upload_sheet_buffer(client_id, sheet_id, data):
    data = json.dumps(data)
    cur.execute(
        """
        INSERT OR REPLACE INTO sheets_buffer (client_id, sheet_id, data)
        VALUES (?, ?, ?)
        """,
        (client_id, sheet_id, data),
    )
    con.commit()


def get_sheet(client_id, sheet_id, version):
    print(f"Getting sheet {sheet_id} version {version}")
    cur.execute(
        "SELECT data FROM sheets WHERE client_id = ? AND sheet_id = ? AND version = ?",
        (client_id, sheet_id, version),
    )
    data = json.loads(cur.fetchone()[0])
    return data


def get_sheet_buffer(client_id, sheet_id):
    cur.execute(
        "SELECT data FROM sheets_buffer WHERE client_id = ? AND sheet_id = ?",
        (client_id, sheet_id),
    )
    data = json.loads(cur.fetchone()[0])
    return data


def get_all_sheet_buffer(client_id):
    cur.execute(
        "SELECT sheet_id, data FROM sheets_buffer WHERE client_id = ?", (client_id,)
    )
    sheets = cur.fetchall()
    return sheets


def delete_sheet(client_id, sheet_id, version):
    print(f"Deleting sheet {sheet_id} version {version}")
    cur.execute(
        "DELETE FROM sheets WHERE client_id = ? AND sheet_id = ? AND version = ?",
        (client_id, sheet_id, version),
    )
    con.commit()


def delete_sheet_buffer(client_id, sheet_id):
    cur.execute(
        "DELETE FROM sheets_buffer WHERE client_id = ? AND sheet_id = ?",
        (client_id, sheet_id),
    )
    con.commit()


def is_sheet_exists(client_id, sheet_id, version):
    cur.execute(
        "SELECT * FROM sheets WHERE client_id = ? AND sheet_id = ? AND version = ?",
        (client_id, sheet_id, version),
    )
    return cur.fetchone() is not None


def get_all_sheets(client_id):
    cur.execute(
        "SELECT sheet_id, version FROM sheets WHERE client_id = ?", (client_id,)
    )
    sheets = cur.fetchall()
    return sheets


def get_same_sheet_version(client_id, sheet_id, data):
    cur.execute(
        "SELECT version, data FROM sheets WHERE client_id = ? AND sheet_id = ?",
        (client_id, sheet_id),
    )
    versions = cur.fetchall()
    for version, sheet_data in versions:
        if sheet_data == json.dumps(data):
            return version
    return None


def find_next_version(client_id, sheet_id):
    cur.execute(
        "SELECT version FROM sheets WHERE client_id = ? AND sheet_id = ?",
        (client_id, sheet_id),
    )
    versions = cur.fetchall()
    if len(versions) == 0:
        return 0
    else:
        return max([version[0] for version in versions]) + 1


"""
Organization of "history"
{
    "infomation": {
        "sheet_state": <sheet_state>,
        "table_diff": <table_diff>,
        "user_prompt": <user_prompt>
    }
    "chat_history": [
        {
            "role": "user / assistant",
            "message": <message>
        }
    ]
}
"""


def create_history(client_id):
    cur.execute(
        "INSERT INTO histories (client_id, history) VALUES (?, ?)", (client_id, "{}")
    )
    con.commit()


def get_history(client_id):
    cur.execute("SELECT history FROM histories WHERE client_id = ?", (client_id,))
    history = json.loads(cur.fetchone()[0])
    return history


def history_exists(client_id):
    cur.execute("SELECT * FROM histories WHERE client_id = ?", (client_id,))
    return cur.fetchone() is not None


def update_history(client_id, history):
    history = json.dumps(history)
    cur.execute(
        "UPDATE histories SET history = ? WHERE client_id = ?", (history, client_id)
    )
    con.commit()


def create_client():
    client_id = str(uuid.uuid4())
    create_history(client_id)
    return client_id


def get_client_statistics(client_id):
    cur.execute(
        "SELECT start_timestamp, end_timestamp, verification_attempts FROM client_statistics WHERE client_id = ?",
        (client_id,),
    )
    statistics = cur.fetchone()
    return statistics


def update_client_start_timestamp(client_id, start_timestamp):
    cur.execute(
        "INSERT INTO client_statistics (client_id, start_timestamp) VALUES (?, ?)",
        (client_id, start_timestamp),
    )
    con.commit()
    statistics = get_client_statistics(client_id)
    log_text(
        client_id,
        f">>> Statistics:\nstart_timestamp: {statistics[0]}\nend_timestamp: {statistics[1]}\nverification_attempts: {statistics[2]}\n",
    )


def update_client_end_timestamp(client_id, end_timestamp):
    cur.execute(
        "UPDATE client_statistics SET end_timestamp = ? WHERE client_id = ?",
        (end_timestamp, client_id),
    )
    con.commit()
    statistics = get_client_statistics(client_id)
    start_timestamp = float(statistics[0])
    stored_end_timestamp = float(statistics[1])
    verification_attempts = statistics[2]
    total_time = stored_end_timestamp - start_timestamp
    log_text(
        client_id,
        f">>> Statistics:\nstart_timestamp: {start_timestamp}\nend_timestamp: {stored_end_timestamp}\nverification_attempts: {verification_attempts}\ntotal_time: {total_time:.2f}s\n",
    )


def update_client_verification_attempts(client_id, verification_attempts):
    cur.execute(
        "UPDATE client_statistics SET verification_attempts = ? WHERE client_id = ?",
        (verification_attempts, client_id),
    )
    con.commit()
    statistics = get_client_statistics(client_id)
    start_timestamp = float(statistics[0])
    stored_end_timestamp = float(statistics[1])
    verification_attempts = statistics[2]
    total_time = stored_end_timestamp - start_timestamp
    log_text(
        client_id,
        f">>> Statistics:\nstart_timestamp: {start_timestamp}\nend_timestamp: {stored_end_timestamp}\nverification_attempts: {verification_attempts}\ntotal_time: {total_time:.2f}s\n",
    )


def get_DSL_functions(client_id):
    cur.execute("SELECT functions FROM DSL_functions WHERE client_id = ?", (client_id,))
    functions = cur.fetchone()[0]
    return json.loads(functions)


def update_DSL_functions(client_id, functions):
    functions_text = json.dumps(functions)

    # Check if the client_id already exists in the table
    cur.execute("SELECT 1 FROM DSL_functions WHERE client_id = ?", (client_id,))
    exists = cur.fetchone()

    if exists:
        # If the client_id exists, update the record
        cur.execute(
            "UPDATE DSL_functions SET functions = ? WHERE client_id = ?",
            (functions_text, client_id),
        )
    else:
        # If the client_id doesn't exist, insert a new record
        cur.execute(
            "INSERT INTO DSL_functions (client_id, functions) VALUES (?, ?)",
            (client_id, functions_text),
        )

    con.commit()
    return get_DSL_functions(client_id)
