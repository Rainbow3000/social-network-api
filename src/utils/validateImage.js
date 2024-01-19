function imageFile(str) {
    // Regex to check valid
    // Image File
    let regex = new RegExp(/[^\s]+(.*?).(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/);
 
    // if str
    // is empty return false
    if (str == null) {
        return "false";
    }
 
    // Return true if the str
    // matched the ReGex
    if (regex.test(str) == true) {
        return "true";
    }
    else {
        return "false";
    }
}
 