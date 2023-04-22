export default function throttle(func, timeout) {
    let timer = null;
    return function perform(...args) {
        if (timer) return;
        func(...args);  
        timer = setTimeout(()=>{                     
            clearTimeout(timer);
            timer = null;
        }, timeout);
    }
}