import logging
import os
from datetime import datetime

first_visit_timestamps = {}


def get_logger(client_id):
    if not os.path.exists("logs"):
        os.makedirs("logs")

    # Check if the client_id already has a timestamp
    if client_id not in first_visit_timestamps:
        # Record the timestamp of the first visit
        first_visit_timestamps[client_id] = datetime.now().strftime("%Y%m%d_%H%M%S")

    # Use the timestamp in the log file name
    timestamp = first_visit_timestamps[client_id]
    log_file = f"logs/client_{timestamp}.log"

    logger = logging.getLogger(f"client_{client_id}")
    if not logger.handlers:
        logger.setLevel(logging.INFO)
        file_handler = logging.FileHandler(log_file)
        formatter = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s\n%(message)s"
        )
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)

    return logger


def log_messages(client_id, function_name, messages):
    logger = get_logger(client_id)
    messages_string = ""
    for item in messages:
        messages_string += f"\n---------------------------------------------------\n** {item['role']} **:\n{item['content']}\n---------------------------------------------------\n\n"
    logger.info(f">>> {function_name}\n {messages_string}")


def log_text(client_id, text):
    logger = get_logger(client_id)
    logger.info(text)


def log_warn(client_id, text):
    logger = get_logger(client_id)
    logger.warning(text)


def log_error(client_id, text):
    logger = get_logger(client_id)
    logger.error(text)
