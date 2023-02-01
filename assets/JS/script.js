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

    const deliveries = document.getElementById('deliveries');
    const addForm = document.getElementById('addForm');
    const nearBox = document.getElementById('near');
    const farBox = document.getElementById('far');
    const veryFarBox = document.getElementById('veryFar');
    const cashBox = document.getElementById('cash');
    const ccBox = document.getElementById('cc');
    const webBox = document.getElementById('web');
    const orderTotal = document.querySelector('.totalOrder');
    
    document.querySelector('#addEntry').onclick = () => {
        deliveries.style.display = 'none';
        addForm.style.display = 'block';
    };

    document.querySelector('#submitDelivery').onclick = () => {
        deliveries.style.display = 'block';
        addForm.style.display = 'none';
    };

    nearBox.addEventListener('change', (n) => {
        if(n.target.checked){
            farBox.checked = false;
            veryFarBox.checked = false;
        }
    });

    farBox.addEventListener('change', (f) => {
        if(f.target.checked){
            nearBox.checked = false;
            veryFarBox.checked = false;
        }
    });

    veryFarBox.addEventListener('change', (v) => {
        if(v.target.checked){
            farBox.checked = false;
            nearBox.checked = false;
        }
    });

    cashBox.addEventListener('change', (ca) =>{
        if(ca.target.checked){
            ccBox.checked = false;
            webBox.checked = false;
            orderTotal.style.display = 'block';
        }
    });

    ccBox.addEventListener('change', (cc) =>{
        if(cc.target.checked){
            cashBox.checked = false;
            webBox.checked = false;
            orderTotal.style.display = 'none';
        }
    });

    webBox.addEventListener('change', (w) =>{
        if(w.target.checked){
            ccBox.checked = false;
            cashBox.checked = false;
            orderTotal.style.display = 'none';
        }
    });
});


