/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(function () {

//     sessionStorage.clear();
    getAllProducts();
    getCategories();
    var notifCart = Object.keys(sessionStorage).length;

    $('#notif_cart').text(notifCart);
});

function getCategories() {

    $.ajax({
        // url: 'http://localhost/ordering-api/index.php?r=site/categories',
        url: 'http://orderingapi.42web.io/ordering-api/index.php?r=site/categories',
        type: 'POST',
//        dataType: "jsonp",
        success: function (res) {
            var response = JSON.parse(res);
            for (var i = 0; i < response.data.length; i++) {

                var idName = response.data[i]['category'].replaceAll(' ', '_');
                $('.categories').append('<li id="li_' + idName.toLowerCase() + '" class="">' +
                        '<a href="#" title="' + response.data[i]['category'] + '" id="' + idName.toLowerCase() + '" data-filter-tags="' + response.data[i]['category'].toLowerCase() + '" onclick="getProducts(this)">' +
                        '<span class="nav-link-text" data-i18n="nav.blankpage">' + response.data[i]['category'] + '</span>' +
                        '</a>' +
                        '</li>');
            }

        },
        error: function (error) {
            console.log("Internal Code Error.");
        }
    });
}

function getProducts(data) {

    $.ajax({
        //url: 'http://localhost/ordering-api/index.php?r=site/products',
        url: 'http://orderingapi.42web.io/ordering-api/index.php?r=site/products',
        type: 'GET',
        data: {'category_name': data.title},
//        dataType: "jsonp",
        beforeSend: function () {
            $('#products').html('');
        },
        success: function (res) {

            var response = JSON.parse(res);

            if (response.data.length === 0) {
                $('#products').append('<div class="col-lg-12 mb-g"><div class="alert alert-warning">No products available.</div></div>');
            }

            for (var i = 0; i < response.data.length; i++) {

                $('#products').append('<div class="col-lg-3 mb-g">' +
                        '<div class="card border m-auto m-lg-0" style="max-width: 18rem;">' +
                        '<img class="card-img-top" alt="' + response.data[i]['description'] + '" id="product_photo_' + response.data[i]['id'] + '">' +
                        '<ul class="list-group list-group-flush">' +
                        '<li class="list-group-item" id="product_name_' + response.data[i]['id'] + '">' + response.data[i]['description'] + '</li>' +
                        '<li class="list-group-item">Price <span id="product_price' + response.data[i]['id'] + '" class="pull-right">₱ ' + response.data[i]['price'] + '</span></li>' +
                        '</ul>' +
                        '<div class="card-body">' +
                        '<a href="#" class="card-link" onclick=\"showBuyNowModal(' + response.data[i]['id'] + ');\">Buy Now</a>' +
                        '<a href="#" class="card-link" onclick=\"showAddToCartModal(' + response.data[i]['id'] + ');\">Add to Cart</a>' +
                        ' </div>' +
                        ' </div>' +
                        '</div>');

                getProductPhoto(response.data[i]['id'], 0);
            }

        },
        error: function (error) {
            console.log(error);
        }
    });
}

function getAllProducts() {

    $.ajax({
        // url: 'http://localhost/ordering-api/index.php?r=site/allProducts',
        url: 'http://orderingapi.42web.io/ordering-api/index.php?r=site/allProducts',
        type: 'POST',
//        dataType: "jsonp",
        beforeSend: function () {
            $('#products').html('');
        },
        success: function (res) {

            var response = JSON.parse(res);
            for (var i = 0; i < response.data.length; i++) {

                $('#products').append('<div class="col-lg-3 mb-g">' +
                        '<div class="card border m-auto m-lg-0" style="max-width: 18rem;">' +
                        '<img class="card-img-top" alt="' + response.data[i]['description'] + '" id="product_photo_' + response.data[i]['id'] + '">      ' +
                        '<ul class="list-group list-group-flush">' +
                        '<li class="list-group-item" id="product_name_' + response.data[i]['id'] + '">' + response.data[i]['description'] + '</li>' +
                        '<li class="list-group-item">Price <span id="product_price' + response.data[i]['id'] + '" class="pull-right">₱ ' + response.data[i]['price'] + '</span></li>' +
                        '</ul>' +
                        ' <div class="card-body">' +
                        '<a href="#" class="card-link" onclick=\"showBuyNowModal(' + response.data[i]['id'] + ');\">Buy Now</a>' +
                        '<a href="#" class="card-link" onclick=\"showAddToCartModal(' + response.data[i]['id'] + ');\">Add to Cart</a>' +
                        ' </div>' +
                        ' </div>' +
                        '</div>');

                getProductPhoto(response.data[i]['id'], 0);
            }

        },
        error: function (error) {
            console.log(error);
        }
    });
}

function getProductPhoto(id, num) {

    $.ajax({
        async: false,
        // url: 'http://localhost/ordering-api/index.php?r=site/productPhoto',
        url: 'http://orderingapi.42web.io/ordering-api/index.php?r=site/productPhoto',
        type: 'POST',
        data: {'product_id': id},
//        dataType: "jsonp",
        beforeSend: function () {
            // $('#products').html('');
        },
        success: function (data) {
            if (num === 0) {
                $('#product_photo_' + id).attr('src', 'data:image/jpg;base64,' + data);
            } else {
                $('#product_photo').attr('src', 'data:image/jpg;base64,' + data);
            }

        },
        error: function (error) {
            console.log('error');
        }
    });
}

function showBuyNowModal(id) {
    var productPrice = $('#product_price' + id).text();
    var productName = $('#product_name_' + id).text();
    $('#product_name_field').val(productName);
    $('#product_price_field').val(productPrice);
    $('#buy_now_qty').val(1);
    $('#oroder_type_check_out').val(1);
    $('.buy-now-modal').modal('show');
    console.log(productName);
}

function showAddToCartModal(id) {
    var productName = $('#product_name_' + id).text();
    var productPrice = $('#product_price' + id).text();

    getProductPhoto(id, 1);

    $('#cart_pn_text').text(productName);
    $('#cart_pr_text').text(productPrice);
    $('#quantity').val('');
    $('.add-to-cart-modal').modal('show');
}

function showCheckOutModal(num, paymentMethod) {
    var buyNowQty = $('#buy_now_qty').val();
    var addToCartQty = $('.add_to_cart_qty').val();

    $('#payment_method').text(paymentMethod);
    $('#receipt_order').html('');

    $('#peyment_method').val(num);

    var totalAmount = 0;
    var deliveryCharge = 50;

    var productNameField = $('#product_name_field').val();
    var productPriceField = $('#product_price_field').val();
    var buyNowQty = $('#buy_now_qty').val();

    var cashOnDelivery = 0;
    var pickUp = 1;
    if (buyNowQty !== '') {
        var productPrice = productPriceField.match(/(\d+)/);

        $('#receipt_order').append('<tr>' +
                '<td>' + productNameField + ' <br />Quantity</td>' +
                '<td>' + productPrice[0] + ' <br /> x' + buyNowQty + '</td>' +
                '</tr>');

        if (num === cashOnDelivery) {
            totalAmount = totalAmount + 50;
            $('#receipt_order').append('<tr>' +
                    '<td>Delivery Charge: </td>' +
                    '<td>' + deliveryCharge + '</td>' +
                    '</tr>');
        }

        var amt = parseInt(productPrice[0]) * buyNowQty;
        totalAmount = totalAmount + amt;

    } else {
        for (var i = 0; i < Object.keys(sessionStorage).length; i++) {

            var fieldName = Object.keys(sessionStorage)[i];
            var fieldValue = sessionStorage.getItem(fieldName);

            var matches = fieldName.match(/(\d+)/);
            if (matches !== null) {
                var fn = fieldName.replaceAll('_', ' ').replaceAll(matches[0], '');
            }

            console.log('Field Name: ' + fieldName + '\nField Value: ' + fieldValue);

            $('#receipt_order').append('<tr>' +
                    '<td>' + fn + ' <br />Quantity</td>' +
                    '<td>' + matches[0] + ' <br /> x' + fieldValue + '</td>' +
                    '</tr>');

            var amt = parseInt(matches[0]) * parseInt(fieldValue);
            totalAmount = totalAmount + amt;

        }
        if (num === cashOnDelivery) {
            totalAmount = totalAmount + 50;
            $('#receipt_order').append('<tr>' +
                    '<td>Delivery Charge: </td>' +
                    '<td>' + deliveryCharge + '</td>' +
                    '</tr>');
        }
    }
    $('#receipt_order').append('<tr>' +
            '<td>Total Amount: </td>' +
            '<td>' + totalAmount + '</td>' +
            '</tr>');

    $('.check-out-modal').modal('show');
}


function addToCartSession() {
    var pn = $('#cart_pn_text').text();
    var pr = $('#cart_pr_text').text();
    var qty = $('#quantity').val();
    var matches = pr.match(/(\d+)/);

    console.log(pn.replaceAll(' ', '_') + '_' + matches[0]);

    if (qty === '' || qty === 0) {
        messageAlert(1, 'Quantity cannot be blank.', 'quantity_status');
        return false;
    }

    setSessionStorage(pn.replaceAll(' ', '_') + '_' + matches[0], qty);

    var notifCart = Object.keys(sessionStorage).length;
    $('#notif_cart').text(notifCart);

    $('.add-to-cart-modal').modal('hide');
}

function showYourCartModal() {
    var notifCart = Object.keys(sessionStorage).length;
    if (notifCart !== 0) {
        $('#order_products').html('');
        for (var i = 0; i < Object.keys(sessionStorage).length; i++) {

            var fieldName = Object.keys(sessionStorage)[i];
            var fieldValue = sessionStorage.getItem(fieldName);

            var matches = fieldName.match(/(\d+)/);
            if (matches !== null) {
                var fn = fieldName.replaceAll('_', ' ').replaceAll(matches[0], '');
                //pn.replaceAll(' ', '_') + '_' + matches[0]
            }

            console.log('Field Name : ' + fieldName + '\nField Value: ' + fieldValue);

            $('#order_products').append(' <div class="col-lg-7">' +
                    '<label>Product Name</label>' +
                    '<input type="text" class="form-control" value="' + fn + '" readonly="">' +
                    '</div>' +
                    '<div class="col-lg-5">' +
                    '<label>Quantity</label>' +
                    '<input type="number" class="form-control add_to_cart_qty" value="' + fieldValue + '" id="' + fieldName + '" onkeyup="setSession(this);\">' +
                    '</div>');

        }

        $('.your-cart-modal').modal('show');
    }
}

function setSession(data) {
    setSessionStorage(data.id, data.value);
}

function setSessionStorage(fieldName, fieldValue) {
    sessionStorage.setItem(fieldName, fieldValue);
}

function checkOut() {

    var buyNow = 1;

    var orderType = $('#oroder_type_check_out').val();
    var paymentMethod = $('#peyment_method').val();


    if (name === '' || phone === '' || email === '' || address === '') {
        messageAlert(1, 'Personal Information are required.', 'check_out_status');
        return false;
    }

    if (orderType == buyNow) {

        var name = $('#name').val();
        var phone = $('#phone').val();
        var email = $('#email').val();
        var address = $('#address').val();

        if (name === '' || phone === '' || email === '' || address === '') {
            messageAlert(1, 'Personal Information are required.', 'check_out_status');
            return false;
        }

        var formdata = {};

        var productField = $('#product_name_field').val();
        var priceField = $('#product_price_field').val();
        var price = priceField.match(/(\d+)/);
        var qty = $('#buy_now_qty').val();

        formdata['name'] = name;
        formdata['phone'] = phone;
        formdata['email'] = email;
        formdata['address'] = address;
        formdata['product'] = productField;
        formdata['price'] = price[0];
        formdata['quantity'] = qty;
        formdata['paymentMethod'] = paymentMethod;

        var apiurl = 'http://localhost/ordering-api/index.php?r=site/buyNow';
        submitData(formdata, apiurl);
        setTimeout(function () {
            location.reload();
        }, 3000);
    } else {

        var name = $('#name_ac').val();
        var phone = $('#phone_ac').val();
        var email = $('#email_ac').val();
        var address = $('#address_ac').val();

        if (name === '' || phone === '' || email === '' || address === '') {
            messageAlert(1, 'Personal Information are required.', 'check_out_status');
            return false;
        }

        var formdata = {};

        formdata['name'] = name;
        formdata['phone'] = phone;
        formdata['email'] = email;
        formdata['address'] = address;

        $.ajax({
            url: 'http://localhost/ordering-api/index.php?r=site/addToCartCustomerInfo',
            type: 'POST',
            data: formdata,
            beforeSend: function () {},
            success: function (res) {
                var data = JSON.parse(res);

                var arrayCustomerID = [];
                updateArrayKeyValue(arrayCustomerID, 'customer_id', data.id);

                if (data.isError === 1) {
                    messageAlert(data.isError, data.message);
                    return false;
                }

                var customer_id = arrayCustomerID['customer_id'];
                for (var i = 0; i < Object.keys(sessionStorage).length; i++) {

                    var fieldName = Object.keys(sessionStorage)[i];
                    var fieldValue = sessionStorage.getItem(fieldName);
                    var field = fieldName.match(/(\d+)/);
                    if (field != null) {
                        var price = field[0];
                    }

                    var products = fieldName.replaceAll('_', ' ').replaceAll(price, '');

                    formdata['customer_id'] = customer_id;
                    formdata['paymentMethod'] = paymentMethod;
                    formdata['product'] = products;
                    formdata['price'] = price;
                    formdata['quantity'] = fieldValue;

                    submitData(formdata, 'http://localhost/ordering-api/index.php?r=site/addToCartCustomerOrders');
                    sessionStorage.clear();
                }

                setTimeout(function () {
                    location.reload();
                }, 3000);
            },
            error: function (error) {
                console.log('error');
            }
        });
    }
}

function submitData(formdata, apiurl) {
    console.log(apiurl);
    $.ajax({
        url: apiurl,
        type: 'POST',
        data: formdata,
        success: function (res) {
            console.log(res);
            var data = JSON.parse(res);
            messageAlert(data.isError, data.message, 'check_out_status');
            console.log(data);
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function updateArrayKeyValue(array, key, value) {
    array[key] = value;
}

function messageAlert(statusID, message, idName) {
    var status;

    status = 'alert-success';
    if (statusID === 1) {
        status = 'alert-danger';
    }

    $('#' + idName).html('<div class="alert ' + status + '">' +
            message +
            '</div>');

    setTimeout(function () {
        $('#check_out_status').html('');
    }, 3000);

}


