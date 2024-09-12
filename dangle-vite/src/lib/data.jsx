const BACK_END_URL = "http://localhost:8000";

async function sendRequest(url, method, data) {
  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(JSON.stringify(errorData));
    }

    return response.json();
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    throw error; // Re-throw the error for higher-level handling if needed
  }
}

export async function sendQuestionToLLMWithoutClientID(status, message) {
  const url = `${BACK_END_URL}/chat`;
  const data = { status, message };
  return sendRequest(url, "POST", data);
}

export async function sendQuestionToLLMWithClientID(
  status,
  message,
  client_id,
) {
  const url = `${BACK_END_URL}/chat`;
  const data = { status, message, client_id };
  return sendRequest(url, "POST", data);
}

export async function analyzeMultiTableIntents(
  client_id,
  status,
  table_list,
  message,
) {
  const url = `${BACK_END_URL}/chat`;
  const data = { client_id, status, table_list, message };
  return sendRequest(url, "POST", data);
}

async function sendFileRequest(url, file, client_id) {
  const formData = new FormData();
  formData.append("file", file);
  if (client_id) {
    formData.append("client_id", client_id); // Append the client_id if provided
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error: ${errorData.detail}`); // Use 'detail' to match the backend error format
    }

    return response.json();
  } catch (error) {
    console.error("There was a problem with the file operation:", error);
    throw error; // Re-throw the error for higher-level handling if needed
  }
}

export async function uploadCSVToBackEnd(file, client_id) {
  console.log("file:", file);
  console.log("client_id:", client_id);
  const url = `${BACK_END_URL}/upload/`;
  return sendFileRequest(url, file, client_id); // Ensure client_id is passed
}

export async function deleteCSVInBackEnd(client_id, sheet_id) {
  const url = `${BACK_END_URL}/delete/`;

  const formData = new FormData();
  formData.append("client_id", client_id);
  formData.append("sheet_id", sheet_id);

  try {
    const response = await fetch(url, {
      method: "DELETE",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error: ${errorData.detail}`);
    }

    return response.json();
  } catch (error) {
    console.error(
      "There was a problem with the file deletion operation:",
      error,
    );
    throw error; // Re-throw the error for higher-level handling if needed
  }
}

export async function analyzeIntentsFromBackEnd(
  sheet_id,
  row_count,
  column_names,
  table_diff,
  user_prompt,
  client_id,
) {
  const url = `${BACK_END_URL}/analyze`;
  const data = {
    sheet_id,
    row_count,
    column_names,
    table_diff,
    user_prompt,
    client_id,
  };
  return sendRequest(url, "POST", data);
}

export async function sendResponseToBackEnd(client_id, response) {
  const url = `${BACK_END_URL}/response`;
  const data = { client_id, response };
  return sendRequest(url, "POST", data);
}

export async function generateDSLFromBackEnd(client_id) {
  const url = `${BACK_END_URL}/generate_dsl`;
  const data = { client_id };
  return sendRequest(url, "POST", data);
}

export async function createClient() {
  const url = `${BACK_END_URL}/login/`;
  return sendRequest(url, "POST");
}

export const executeDSLFromBackEnd = async (
  clientId,
  sheetId,
  fn,
  stringArgs,
) => {
  const payload = {
    client_id: clientId,
    sheet_id: sheetId,
    dsl: fn,
    arguments: stringArgs,
  };
  console.log("Payload:", payload);

  const url = `${BACK_END_URL}/execute_dsl/`;
  return sendRequest(url, "POST", payload);
};

export const executeDSLListFromBackEnd = async (clientId, dsl) => {
  const payload = {
    client_id: clientId,
    dsl_list: {
      required_tables: dsl.required_tables,
      program: dsl.program.map((prog) => ({
        function_name: prog.function_name,
        arguments: prog.arguments,
        function: prog.function || null,
        condition: prog.condition || null,
      })),
      step_by_step_plan: dsl.step_by_step_plan,
    },
  };
  console.log("Payload:", payload);

  const url = `${BACK_END_URL}/execute_dsl_list/`;
  return sendRequest(url, "POST", payload);
};

export async function isFileExists(client_id, file_name) {
  console.log("client_id:", client_id);
  console.log("file_name:", file_name);
  const url = `${BACK_END_URL}/is_file_exists/`;
  const data = { client_id, file_name };
  return sendRequest(url, "POST", data);
}

export async function getDependencies() {
  const url = `${BACK_END_URL}/get_dependencies/`;
  return sendRequest(url, "GET");
}

export async function editDSLFromBackEnd(clientId, dsl, newInstruction) {
  const url = `${BACK_END_URL}/edit_dsl`;
  const data = {
    client_id: clientId,
    dsl: {
      function_name: dsl.function_name,
      arguments: dsl.arguments,
      condition: dsl.condition || null,
    },
    new_instruction: newInstruction,
  };
  console.log("Sending data to edit_dsl:", data); // Add this for debugging
  return sendRequest(url, "POST", data);
}
