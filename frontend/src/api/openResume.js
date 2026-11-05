import api from "./api";

async function getErrorMessage(error) {
    const data = error?.response?.data;

    if (data instanceof Blob) {
        try {
            const text = await data.text();
            const parsed = JSON.parse(text);
            return parsed.message || parsed.error || "Unable to open this resume.";
        } catch {
            return "Unable to open this resume.";
        }
    }

    if (typeof data === "string" && data.trim()) {
        return data;
    }

    if (data?.message) {
        return data.message;
    }

    return "Unable to open this resume. The file may no longer exist on the server.";
}

export async function openResumePdf(resumeId) {
    if (!resumeId) {
        window.alert("Resume is not available.");
        return;
    }

    const newTab = window.open("", "_blank");

    try {
        const response = await api.get(`/resume/view/${resumeId}`, {
            responseType: "blob"
        });

        const contentType =
            response.headers?.["content-type"] || "application/pdf";

        const blob = new Blob([response.data], {
            type: contentType.includes("pdf") ? "application/pdf" : contentType
        });

        const url = URL.createObjectURL(blob);

        if (newTab && !newTab.closed) {
            newTab.location.href = url;
        } else {
            const link = document.createElement("a");
            link.href = url;
            link.download = "resume.pdf";
            document.body.appendChild(link);
            link.click();
            link.remove();
        }

        setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (error) {
        if (newTab && !newTab.closed) {
            newTab.close();
        }

        console.error("Failed to open resume:", error);
        window.alert(await getErrorMessage(error));
    }
}
