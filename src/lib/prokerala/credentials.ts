export async function getProkeralaToken() {
    const formData = new FormData();

    formData.set("grant_type", "client_credentials");
    formData.set("client_id", process.env.PROKERALA_CLIENT_ID!);
    formData.set("client_secret", process.env.PROKERALA_CLIENT_SECRET!);

    const response = await fetch("https://api.prokerala.com/token", {
        method: "post",
        body: formData,
    });
    const data = await response.json();

    return data.access_token;
}

export const prokeralaToken = await getProkeralaToken();
