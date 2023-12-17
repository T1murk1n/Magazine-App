// Поля для хранения
// 1. ФИО -> отдельные поля Имя* Фамилия Отчество
// 2. Сфера деятельности
// 3. Тел*
// 4. Email
let el_body = document.querySelector('.body');

function formatPhone(phone){
    let arr_phone = phone.toString()

    if (arr_phone.length == 11){
        return '+' + arr_phone[0] + ' (' + arr_phone.slice(1, 4) + ') ' +  arr_phone.slice(4, 7) + ' ' + arr_phone.slice(7, 9) + ' ' + arr_phone.slice(9)
    } else {
        return '----';
    }
}

function format_output(fieldName, fieldValue){
    if (fieldName == 'phone'){
        return formatPhone(fieldValue);
    }
    return fieldValue;
}


function renderString(idx, element){
    let dopClass = '';
    if (element.deleted){
        dopClass = ' isDeleted'
    }

    element.fio = `${element.firstName} ${element.secondName} ${element.thirdName}`;

    let formated = {
        'fio':   format_output('fio',   element.fio),
        'work':  format_output('work',  element.work),
        'phone': format_output('phone', element.phone),
        'email': format_output('email', element.email),
    };

    let str_out = 
    `<div class="row${dopClass}" data-idrecord="${element.id}">
        <div class="cell num">${idx}</div>
        <div class="cell fio"   data-fieldname="fio"   data-fieldvalue="${element.fio}">${formated.fio}</div>
        <div class="cell work"  data-fieldname="work"  data-fieldvalue="${element.work}">${formated.work}</div>
        <div class="cell phone" data-fieldname="phone" data-fieldvalue="${element.phone}">${formated.phone}</div>
        <div class="cell email" data-fieldname="email" data-fieldvalue="${element.email}">${formated.email}</div>                
        <div class="cell action"><span class="del"></span></div>
    </div>`;

    return str_out;
}

function renderModel(model){
    if (el_body){
        let idx = 1;
        let str_out = '';
        model.forEach(element => {
            str_out += renderString(idx, element)
            idx++;
        });

        str_out += 
        `<div class="row row--last">
            <div class="cell num"></div>
            <div class="cell fio required"></div>
            <div class="cell work"></div>
            <div class="cell phone required"></div>
            <div class="cell email" ></div>                
            <div class="cell action"><span class="add" title="Добавить новую запись"></span></div>
        </div>`;

        el_body.innerHTML = '';
        el_body.insertAdjacentHTML('afterbegin', str_out);
        el_body.setAttribute('data-state', 'normal');
    }
}



function localStorage_isPresent(){
    if ( window.localStorage ) return true;
    return false;
}

function localStorage_read(key){
    if (localStorage_isPresent()){
        let str_from_storage = window.localStorage.getItem(key);
        if (str_from_storage){
            return str_from_storage;
        }
    }
    return null;
}

function localStorage_write(key, str_to_save){
    if (localStorage_isPresent()){
        window.localStorage.setItem(key, str_to_save)
        return str_to_save;
    }
    return null;
}

function model_load(){
    let str_model = localStorage_read('model');
    if (str_model){
        let obj = JSON.parse(str_model); // '{field:1}' -> field:1
        return obj;
    }

       return [
        {
            id: "19646215333131",
            deleted: true,
            firstName: "John",
            secondName: "Doe",
            thirdName: "Sai",
            work: "desiner",
            phone: "79275673476",
            email: ["email@mail.ru", "yandex.ru"],
        },
        {        
            id: "2648315203161",
            deleted: false,
            firstName: "Alice",
            secondName: "Livaeva",
            thirdName: "",
            work: "photograth",
            phone: "77833466736",
            email: "yandex@yu.ru",
        },
        {
            id: "1348815253133",
            deleted: true,
            firstName: "Alex",
            secondName: "Dumski",
            thirdName: "",
            work: "driver",
            phone: "79275673476",
            email: "email@mail.ru",
        },
        {        
            id: "7448216253351",
            deleted: false,
            firstName: "Margaret",
            secondName: "Pomanova",
            thirdName: "",
            work: "writer",
            phone: "77833466736",
            email: "yandex@yu.ru",
        },
    ];
}

function model_save(model){
    localStorage_write('model', JSON.stringify(model) );
}



function app_init(selector){
    let model = model_load();
    renderModel(model);

    
    if (selector){
        selector.addEventListener('click', (e) => {
            if (e.target.classList.contains('del')){
                handleDelete(model, e.target);
            }
            if (e.target.classList.contains('add')){
                handleAdd(model, e.target);
            }
        });
    
        selector.addEventListener('dblclick', (e) => {
            if (e.target.classList.contains('cell')){
                if (e.target.classList.contains('num')) return;
                if (e.target.classList.contains('action')) return;
    
                insert_input_in_cell(model, e.target);
            }
        });
    }
    
}


function updateModel(model, idRec, fieldName, fieldValue){
    for(let el of model){
        if (el.id == idRec){
            if (fieldName == 'fio'){
                let ar_fio = fieldValue.split(" ")
                el.firstName  = ar_fio[0];

                if (ar_fio.length > 1)
                    el.secondName = ar_fio[1];
                else
                    el.secondName = '';

                if (ar_fio.length > 2)
                    el.thirdName  = ar_fio[2];
                else 
                    el.thirdName  = '';

                model_save(model);
                return;
            }

            if (fieldName == 'phone'){
                el.phone = fieldValue.replace(/\D+/g, '');
                console.log('el.phone', el.phone);

                model_save(model);
                return;
            }

            el[fieldName] = fieldValue;
            model_save(model);
        }
    }
}

// удаление row
function deleteRecord(model, idRec){
    for(let el of model){
        if (el.id == idRec){
            el.deleted = true;
            model_save(model);
            return true;
        }
    }

    return false;
}
// восстановление row
function unDeleteRecord(model, idRec){
    for(let el of model){
        if (el.id == idRec){
            el.deleted = false;
            model_save(model);
            return true;
        }
    }

    return false;
}

// Обработчик кнопки delete
function handleDelete(model, el_span){
    let el_row = el_span.parentNode.parentNode;
    if (el_row.classList.contains('isDeleted')){
        if (unDeleteRecord(model, el_row.dataset.idrecord)){
            el_row.classList.remove('isDeleted');
        } else {
            alert('нет такой записи')
        }
    } else {
        if (deleteRecord(model, el_row.dataset.idrecord)){
            el_row.classList.add('isDeleted')
        } else {
            alert('нет такой записи')
        }
    }
}
// клик по плюсику
function handleAdd(model, el_target){
    el_body.setAttribute('data-state', 'addition');
    
    let saved_obj = {
        id:Date.now(),
        deleted:false,
        firstName:"", 
        secondName:"", 
        thirdName:"",
        work:"",
        phone:"",
        email:[]        
    };

    let str_add = renderString(model.length + 1, saved_obj);

    el_target.parentNode.parentNode.insertAdjacentHTML('beforebegin', str_add);
    let el_row = el_body.querySelector('.row[data-idrecord="'+saved_obj.id+'"]');
    
    insert_input_in_cell(model, el_row.querySelector('.fio'), 
        input_in_cell_enter, input_in_cell_cancel
    );
}


// нажатие по enter при редактировании ячейки
function input_in_cell_enter(model, el_target, fieldValue){
    if (el_target.dataset.fieldname == 'fio'){
        // переключиться на работу
        
        insert_input_in_cell(model, el_target.parentNode.querySelector('.work'),
            input_in_cell_enter, input_in_cell_cancel
        );
        return;
    }
    if (el_target.dataset.fieldname == 'work'){
        // переключиться на телефон
        
        insert_input_in_cell(model, el_target.parentNode.querySelector('.phone'),
            input_in_cell_enter, input_in_cell_cancel
        );
        return;
    }
    if (el_target.dataset.fieldname == 'phone'){
        //записать в модель новую запись;
        model.push({
            id: el_target.parentNode.dataset.idrecord+"",
            deleted: false,
            firstName: el_target.parentNode.querySelector('.fio').dataset.fieldvalue.split(" ")[0]+"", 
            secondName: el_target.parentNode.querySelector('.fio').dataset.fieldvalue.split(" ")[1]+"", 
            thirdName: el_target.parentNode.querySelector('.fio').dataset.fieldvalue.split(" ")[2]+"",
            work: el_target.parentNode.querySelector('.work').dataset.fieldvalue+"",
            phone: fieldValue+"",
            email: el_target.parentNode.querySelector('.email').dataset.fieldvalue+"",
        })
        model_save(model)
        el_body.setAttribute('data-state', 'normal');
        return;
    }
}
// закрытие(расфокус) input при редактировании ячейки
function input_in_cell_cancel(model, filedName, fieldValue){
    if(fieldValue == '' || fieldValue == '  '){
        el_body.querySelector('.row:nth-last-child(-n+2)').remove()
        el_body.setAttribute('data-state', 'normal');
    }
}
//редактирование ячейки
function insert_input_in_cell(model, el_cell, cb_enter = null, cb_cancel = null){
    let content = el_cell.dataset.fieldvalue;
    let el_input = document.createElement('input');

    el_input.value = content;
    el_cell.innerHTML = '';
    el_input.saved_content = content;

    el_cell.insertAdjacentElement('beforeend', el_input);
    el_input.focus();

    el_input.myParentNode = el_cell;
    el_input.addEventListener('keyup', (e) => {
        if (e.key == 'Enter'){
            updateModel(model, e.target.parentNode.parentNode.dataset.idrecord, 
                e.target.parentNode.dataset.fieldname, 
                e.target.value);
                // e.target.parentNode.innerHTML = format_output(e.target.parentNode.dataset.fieldname, e.target.value);                                    
                e.target.updatedValue = e.target.value;
                if (cb_enter)
                    cb_enter(model, e.target.parentNode, e.target.value)
                e.target.blur();
        } else
        if (e.key == 'Escape'){
            // e.target.parentNode.innerHTML = format_output(e.target.parentNode.dataset.fieldname, e.target.saved_content);
            e.target.updatedValue = e.target.saved_content;
            e.target.blur();
        }
    });

    el_input.addEventListener('blur', (e) => {
        if (!e.target.updatedValue) e.target.updatedValue = e.target.saved_content;
        e.target.myParentNode.innerHTML = format_output(e.target.myParentNode.dataset.fieldname, e.target.updatedValue);                    
        e.target.myParentNode.setAttribute('data-fieldvalue', e.target.updatedValue)

        if (cb_cancel)
            cb_cancel(model, e.target.myParentNode.dataset.fieldname, e.target.updatedValue)
    });
}


app_init(el_body);