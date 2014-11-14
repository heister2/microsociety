$(document).ready(function() {
  $('#student-btn').click(function(e) {
    e.preventDefault();
    $('#student').toggle();
    $('#teacher').hide();
    $('#admin').hide();
  });

  $('#teacher-btn').click(function(e) {
    e.preventDefault();
    $('#teacher').toggle();
    $('#student').hide();
    $('#admin').hide();
  });

  $('#admin-btn').click(function(e) {
    e.preventDefault();
    $('#admin').toggle();
    $('#student').hide();
    $('#teacher').hide();
  });

  var total = 0;
  var itemArray = [];
  var priceArray = [];
  var inventoryItem = {};
  var counter = 0;

  $('#itemized-btn').click(function(e) {
    e.preventDefault();

     var itemPrice = $('#item').val();
     var arr = itemPrice.split(' ');
     var item = arr[0];
     var price = arr[1];
     var quantity = $('#quantity').val();
     var subtotal = Number(price) * Number(quantity);
    // priceArray.push(subtotal);
    // total += subtotal;

    // inventoryItem[item] = {
    //   item: item,
    //   quantity: quantity,
    //   price: price
    // };

    // console.log(inventoryItem);

    // itemArray.push([item, quantity]);

    $('#shopping-cart').append('<tr><td id="item' + counter + '">' + item + '</td><td id="number' + counter + '">' + quantity + '</td><td id="charge' + counter + '">' + price + '</td><td>' + subtotal.toFixed(2) + '</td><td><a class="delete" href="#">Delete</a></td></tr>');
    $('#item option:eq(0)').attr('selected', 'selected');
    $('#quantity').val('');
    counter++;
  });

  $('#make-transaction').on('click', function(e) {
    e.preventDefault();
    var rowCount = $('#shopping-cart tr').length;
    var count = 0;
    for (var i = 0; i < rowCount - 1; i++) {
      var item = $('#item' + count).text();
      var quantity = $('#number' + count).text();
      var price = $('#charge' + count).text();
      inventoryItem[count] = {
        item: item,
        quantity: quantity,
        price: price
      }
      count++;
    }
    
    var itemList = [];
    var purchaseTotal = 0;
    for (var i = 0; i < Object.keys(inventoryItem).length; i++) {
      var it = inventoryItem[i]["item"];
      var p = inventoryItem[i]["price"];
      var q = inventoryItem[i]["quantity"];
      itemList.push([it, q]);
      purchaseTotal += Number(p) * Number(q);
    }

    $('#charge-total').css('opacity', '1.0');
    $('#items').val(itemList);
    $('#total').val(purchaseTotal.toFixed(2));
  });

  $('#shopping-cart').on('click', '.delete', function(e) {
    e.preventDefault();
    $(this).closest('tr').remove();
    counter--;
  });

  $('#transaction').click(function(e){
    total = 0;
    itemList = [];
    counter = 0;
    inventoryItem = {};
    purchaseTotal = 0;
  })
});