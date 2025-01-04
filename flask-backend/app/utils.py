from flask import jsonify


def create_response(status_code, message, data=None):
    """
    Create a standard JSON response.

    Args:
        status_code (int): HTTP status code for the response.
        message (str): Message to include in the response.
        data (dict or list, optional): Additional data to include in the response.

    Returns:
        Response: Flask JSON response object.
    """
    response = {
        "status": status_code,
        "message": message,
    }
    if data is not None:
        response["data"] = data
    return jsonify(response), status_code
