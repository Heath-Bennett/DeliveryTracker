//When Document Loads
$(document).ready(function(){
    
    //define global variables
    let nearDeliver = 0;
    let nearDollar = 0;
    let farDeliver = 0;
    let farDollar = 0;
    let veryFarDeliver = 0;
    let varyFarDollar = 0;
    let totalDeliver = 0;
    let totalDollar = 0;
    let ccGratuity = 0;
    let totalCC = 0;
    let cashGratuity = 0;
    let totalCashOwed = 0;
    let nightTotal = 0;
    
    document.querySelector('#addEntry').onclick = () => {
        console.log('button clicked');
        document.getElementById('deliveries').style.display = 'none';
        document.getElementById('addForm').style.display = 'block';
    };

    document.querySelector('#submitDelivery').onclick = () => {
        document.getElementById('deliveries').style.display = 'block';
        document.getElementById('addForm').style.display = 'none';
    };
});


