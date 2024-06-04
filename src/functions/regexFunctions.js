export const isValidEmail = (email) => {
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)
}

export const isValidPassword = (password) => {
    return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(password)
}

export const isEditorEmpty = (value) => {
    return String(value)
        .replace(/<(.|\n)*?>/g, "")
        .trim().length === 0
}