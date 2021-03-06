$(document).ready(function(){

	/*******  Purchase Form Jquery ********/

		var ajaxBootup = ajaxCall('purchase/displayItems',{});
		$('#tableData').html(ajaxBootup);
		disableSelection(document.body);

		var totalBillAmount = ajaxCall('purchase/getTotalAmount',{},'json');
		$('#totalPricePurchase').html(totalBillAmount.total+'/-');

		$('input[name=startAddItem]').click(function(){

			var result = purchaseBillValidations();
			if(result == true){
				$('input[name=billnum]').attr('disabled','disabled');
				$('select[name=vendor]').attr('disabled','disabled');
				$('input[name=billDate]').attr('disabled','disabled');
				$('.ShowHide').prop('disabled',false);
			}
			
		});

		$('input[name=addToList]').click(function(){

			var SendData = {};
			$('input, select, textarea').each(function(index){

				var input = $(this);
				SendData[input.attr('name')] = input.val();
			});
			
			var result = purchaseItemValidation(SendData);
			if(result == true){

				var ajaxResult = ajaxCall('purchase/insertIntoGrid',SendData);
				$('#tableData').html(ajaxResult);
				setValueBlankPurchase();
			}
			var totalBillAmount = ajaxCall('purchase/getTotalAmount',{},'json');
			$('#totalPricePurchase').html(totalBillAmount.total);
			
		});

		$('input[name=savePurchaseList]').click(function(){

			if(confirm('Are you sure to save the list?')){
				
					$('#saveSpinner').show();
					ajaxCall('purchase/savePurchaseList',{});
					$('#tableData').html('');
					$('input[name=billnum]').prop("disabled", false);
					$('select[name=vendor]').prop("disabled", false);
					$('input[name=billDate]').prop("disabled", false);
					$('#ItemDetails').fadeOut(300);
					$('#saveSpinner').hide();
					alert('Your bill saved successfully!');
			}
			
		});

		$('input[name=resetData]').click(function(){

			window.location.reload();
		});

		$(document).on('dblclick','.tbDatagrid_PurchaseItem tr', function(){
			var input = $(this);
			if(confirm('Are you sure to delete that row?')){

				
					var barCode = input.children('td:nth-child(4)').html();
					var result = ajaxCall('purchase/deleteFromList',{'barCode':barCode});
					$('.tbDatagrid_PurchaseItem').html(result);

					var totalBillAmount = ajaxCall('purchase/getTotalAmount',{},'json');
					$('#totalPricePurchase').html(totalBillAmount.total);
				
			};
		});

		$('#barCode').keyup(function(event){

			if(event.keyCode == 13){

				var barCode = $(this).val();
				var result = ajaxCall('purchase/getItemDetails',{'barcode':barCode},'json');
				$('input[name=prodName]').val(result[0].item_name);
				$('textarea[name=prodDesc]').val(result[0].item_desc);
			}
		});

		function purchaseBillValidations(){

			if(
				$('input[name=billnum]').val().trim() == ''  ||
			    $('select[name=vendor]').val().trim() == ''  ||
			    $('input[name=billDate]').val().trim() == ''
			   ){

				alert('Please fill required fields');
			return false;
			}else{

				return true;
			}
		}


		function purchaseItemValidation(objData){

			if(
					objData.barCode == '' ||
					objData.billDate == '' ||
					objData.billnum == '' ||
					objData.prodName == '' ||
					objData.sku == '' ||
					objData.expiryDate == '' ||
					objData.prodDesc == '' ||
					objData.purchasePrice == '' ||
					objData.qty == '' ||
					objData.salePrice == '' ||
					objData.mrp == ''
			  ){

				alert('Please fill required fields');
				return false;
			}else{

				return true;
			}
		}


		function setValueBlankPurchase(){

			$('input[name=barCode]').val('');
			$('input[name=prodName]').val('');
			$('textarea[name=prodDesc]').val('');
			$('input[name=mrp]').val('');
			$('input[name=sku]').val('');
			$('input[name=expiryDate]').val('');
			$('input[name=salePrice]').val('');
			$('input[name=purchasePrice]').val('');
			$('input[name=qty]').val('');
			$('input[name=FreeItemCode]').val('');
			$('input[name=FreeQty]').val('');
			$('input[name=freeMrp]').val('');
			$('input[name=barCode]').focus();
		}


	/******* End Purchase Form Jquery *******/


	function ajaxCall(ctrlFunc, jsonData, resType){

			var finalResult = '';
			$.ajax({
				type:'POST',
				url: base_url+'index.php/'+ctrlFunc,
				data: jsonData,
				async: false,
				success: function(result){

					finalResult = result;
				}
			});
			if(resType == 'json'){

				return $.parseJSON(finalResult);
			}else{
				return finalResult
			}
	}


	setInterval(
		function(){ 
			$('#blink').fadeToggle(300); 
		}, 600);



/*
*
*
*
*
*
*
*
*        Store Trsnafer Work
*
*
*
*
*
*
*
/


	/*****************  Store Transfer  *****************/



	$('select[name=transferStore]').change(function(){

		$('#blink').html($('select[name=transferStore] option:selected').html());
		$(this).attr('disabled','disabled');
	});


	$('input[name=barcode]').keyup(function(event){

		if(event.keyCode == 13){

            var barcValue = $('input[name=barcode]').val();
            $('.spinLoader').fadeIn(300);             
            var getByBarcode = ajaxCall('stores/getItemDetails',{'barcode':barcValue},'json');
			console.log(getByBarcode);
			if(getByBarcode.status == 'false'){

				$('.spinLoader').fadeOut(300);
				alert('Item not found');
			}else{

				$('input[name=prodName]').val(getByBarcode.data[0].item_name);
				$('input[name=cqty]').val(getByBarcode.data[0].item_qty); 
				$('input[name=sale_price]').val(getByBarcode.data[0].free_item_price); 
				$('input[name=free_item_barcode]').val(getByBarcode.data[0].free_item_barcode); 
				$('input[name=free_item_name]').val(getByBarcode.data[0].free_item_name); 
				$('input[name=free_item_qty]').val(getByBarcode.data[0].free_item_qty); 
				$('input[name=mrp]').val(getByBarcode.data[0].item_mrp); 
				$('input[name=sale_price]').val(getByBarcode.data[0].item_sale_price); 
				$('input[name=item_desc]').val(getByBarcode.data[0].item_desc); 
				$('input[name=item_sku]').val(getByBarcode.data[0].item_sku); 
				$('input[name=item_expiry]').val(getByBarcode.data[0].item_expiry); 
				$('input[name=item_unit]').val(getByBarcode.data[0].item_unit); 
				$('input[name=item_category]').val(getByBarcode.data[0].item_category); 
				$('input[name=category]').val(getByBarcode.data[0].item_category); 
				$('input[name=unit]').val(getByBarcode.data[0].item_unit); 
				$('.expDate').html(getByBarcode.data[0].item_expiry);
				$('.spinLoader').fadeOut(300);
				var SqlDate = getByBarcode.data[0].item_expiry;
				var splitedDate = SqlDate.split('-');

				var sDD = splitedDate[2];
				var sMM = splitedDate[1];
				var sYY = splitedDate[0];

				var today = new Date();
				var dd = today.getDate();
				var mm = today.getMonth()+1; //January is 0!
				var yyyy = today.getFullYear();

				var date1 = new Date(dd+'/'+mm+'/'+yyyy);
				var date2 = new Date(sMM+'/'+sDD+'/'+sYY);
				var timeDiff = Math.abs(date2.getTime() - date1.getTime());
				var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 

				if(diffDays<=0){
					$('.expryLabel').html('(Your product has been expired!)');
					$('input[name=qty]').attr('disabled','disabled');
				}else{

					$('.expryLabel').html('(Your product hwill expire in '+diffDays+')');
				}
				$('input[name=qty]').focus();
			}
	    }
	});


	$('input[name=qty]').keyup(function(event){

		if(event.keyCode == 13){
			$('input[name=addToTransferList]').click();
		}
	});


	var gridTable = ajaxCall('stores/displayTransferGrid', {});

	$('.transferGrid').html(gridTable);

	var totalItems = ajaxCall('stores/getTotalItems',{},'json');
	$('#totalItm').html(totalItems.total);

	var totalData = ajaxCall('stores/getSalePriceAndMrp',{},'json');
	if(totalData != null){
		$('#totalSale').html(totalData[0]+'/-');
		$('#totalMrp').html(totalData[1]+'/-');
	}
	

	$('input[name=addToTransferList]').click(function(){

		if(parseInt($('input[name=qty]').val()) > parseInt($('input[name=cqty]').val())){

			alert('You cannot enter more than current quantity!!');
			return false;
		}
		var SendData = {};
		$('input, select, textarea').each(function(index){

			var input = $(this);
			SendData[input.attr('name')] = input.val();
		});

		var gridTable = ajaxCall('stores/insertToStoreGrid', SendData);
		var totalItems = ajaxCall('stores/getTotalItems',{},'json');
		$('#totalItm').html(totalItems.total);

		$('.transferGrid').html(gridTable);
		$(".transferGrid").animate({ scrollTop: $(document).height() }, 1000);

		var totalData = ajaxCall('stores/getSalePriceAndMrp',{},'json');
		$('#totalSale').html(totalData[0]+'/-');
		$('#totalMrp').html(totalData[1]+'/-');

		$('input, textarea').each(function(index){

			if($(this).attr('type') != 'submit'){

				$(this).val('');
			}
		});

		$('input[name=barcode]').focus();

		console.log(SendData);
	});


	$(document).on('dblclick','.tbDatagrid_StoreTransferItem tr', function(){
		var row = $(this);
		$(this).children('td').addClass('color-danger');
		//console.log($(this).html());
		// return false;
		if(confirm('Are you sure to delete that row?')){

			
				var barCode = row.children('td:nth-child(1)').html();
				$('input[name=barcode]').val(barCode);
				$('input[name=barcode]').focus();
				var result = ajaxCall('stores/deleteGridTableRow',{'index':row.index()});
				var totalData = ajaxCall('stores/getSalePriceAndMrp',{},'json');
				var totalItems = ajaxCall('stores/getTotalItems',{},'json');
				if(totalData != null){

					$('#totalItm').html(totalItems.total);
					$('#totalSale').html(totalData[0]+'/-');
					$('#totalMrp').html(totalData[1]+'/-');
					$('.tbDatagrid_StoreTransferItem').html(result);
				}else{

					$('#totalItm').html('');
					$('#totalSale').html('');
					$('#totalMrp').html('');
					$('.tbDatagrid_StoreTransferItem').fadeOut(200);
				}
				

				
		}
	});

	$(".qsbsearch_fieldox").keyup(function() {
	    $('.crud_search').click();
	});

	$(document).on('dblclick',"#flex1 tr", function(){

		$('input[name=barcode]').val($(this).children('td:nth-child(1)').children('div').html());
		$('input[name=barcode]').focus();
	});



	$('input[name=SaveTransfer]').click(function(){ 

		
    	window.open(base_url+'index.php/stores/viewInvoice','winname','directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=800,height=350,left=250,top=150,status=1,directories=1,dialog');

    	setTimeout(
		  function() 
		  {
		    ajaxCall('stores/saveStoreStransfer',{});
		  }, 3000);

    	$('#totalItm').html('');
    	$('#totalMrp').html('');
    	$('#totalItm').html('');
    	$('#blink').html('');
		$('.transferGrid').html('');

	});



	/****************   Store End   ********************/







	function disableSelection(target){
        if (typeof target.onselectstart!="undefined") //IE route
            target.onselectstart=function(){return false}
        else if (typeof target.style.MozUserSelect!="undefined") //Firefox route
            target.style.MozUserSelect="none"
        else //All other route (ie: Opera)
            target.onmousedown=function(e){if(e && e.target && e.target.tagName){if(/^(input|select|textarea)$/i.test(e.target.tagName)){return true;}}return false;}
        target.style.cursor = "default"
    }
});

