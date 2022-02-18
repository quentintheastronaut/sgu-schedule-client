export function dateToIndex(date){

    let index;

    switch(date){
        case 'Hai':
            index = 1;
            break;
        case 'Ba':
            index = 2;
            break;
        case 'Tư':
            index = 3;
            break;
        case 'Năm':
            index = 4;
            break;
        case 'Sáu':
            index = 5;
            break;
        case 'Bảy':
            index = 6;
            break;
        case 'Chủ nhật':
            index = 7;
            break;
        default: 
            break;
    }
    return index;
}

export function indexToDate(index){

    let date;

    switch(index){
        case 1:
            date = 'Thứ Hai';
            break;
        case 2:
            date = 'Thứ Ba';
            break;
        case 3:
            date = 'Thứ Tư';
            break;
        case 4:
            date = 'Thứ Năm';
            break;
        case 5:
            date = 'Thứ Sáu';
            break;
        case 6:
            date = 'Thứ Bảy';
            break;
        case 7:
            date = 'Chủ nhật';
            break;
        default: 
            break;
    }
    return date;
}
