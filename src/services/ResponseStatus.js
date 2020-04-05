export const OK = 200;
export const OK_NO_CONTENT = 203;
export const UNAUTHORIZED = 401;
export const NOT_FOUND = 404;
export const FORBIDDEN = 405;

export function ok(status){
    return(status >= 200 && status < 300);
}
