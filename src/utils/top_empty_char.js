

export function top_empty_char(guess_chars) {

    for(let i = 0; i < guess_chars.length; i++) {
        if(guess_chars[i].letter === "") {
            return i;
        }
    }

    return -1;
}

export function top_empty_chars_code(guess_chars) {
    for(let i = 0; i < guess_chars.length; i++) {
        if(guess_chars[i].code === "") {
            return i;
        }
    }

    return -1;
}

export function all_correct_entries(guess_chars) {
    return guess_chars.every(obj => obj.code === "GREEN");
}
