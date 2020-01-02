/*Dropdown Menu*/
$(document).ready(function() {
    $('.dropdown').click(function () {
        $(this).attr('tabindex', 1).focus();
        $(this).toggleClass('active');
        $(this).find('.dropdown-menu').slideToggle(300);
    });

    $('.dropdown').focusout(function () {
        $(this).removeClass('active');
        $(this).find('.dropdown-menu').slideUp(300);
    });

    $('.dropdown .dropdown-menu li').click(function () {
        $(this).parents('.dropdown').find('span').text($(this).text());
        let value = "";
        switch ($(this).attr('id')){
            case "pascal":
                value = "pas";
            break;
            case "clike":
                value = "cpp";
            break;
            case "java":
                value = "jav";
            break;
            case "python":
                value = "py";
            break;
        }
        $(this).parents('.dropdown').find('input').attr('value', value);
        editor.setOption("mode", $(this).attr('id'));
    });
    /*End Dropdown Menu*/
})
