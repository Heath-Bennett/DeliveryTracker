//When Document Loads
$(document).ready(function(){
    
    //define global variables
    let nearDeliver = 0;
    let nearDollar = 0;
    let farDeliver = 0;
    let farDollar = 0;
    let veryFarDeliver = 0;
    let veryFarDollar = 0;
    let totalDeliver = 0;
    let totalDollar = 0;
    let ccGratuity = 0;
    let totalCC = 0;
    let cashGratuity = 0;
    let totalCashOwed = 0;
    let nightTotal = 0;
    let deliveryCount = 0;
    let delFee = 0;
    let delPayment = '';
    
    const deliveries = document.getElementById('deliveries');
    const addForm = document.getElementById('addForm');
    const nearBox = document.getElementById('near');
    const farBox = document.getElementById('far');
    const veryFarBox = document.getElementById('veryFar');
    const cashBox = document.getElementById('cash');
    const ccBox = document.getElementById('cc');
    const webBox = document.getElementById('web');
    const totalOrder = document.querySelector('.totalOrder');
    const address = document.getElementById('address');
    const gratuity = document.getElementById('gratuity');
    const orderTotal = document.getElementById('orderTotal');
    const table = document.getElementById('deliver');
    const deliveryList = [];
    
    //This will ensure there are two decimal places for dollar amounts.
    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits:2,
    });
    
    //This creates a Delivery object
    function Delivery (deliveryStop, deliveryAddress, deliveryFee, deliveryPayment, deliveryGratuity, deliveryTotal) {
        this.stop = deliveryStop, 
        this.address = deliveryAddress, 
        this.fee = deliveryFee, 
        this.payment = deliveryPayment, 
        this.gratuity = parseFloat(deliveryGratuity),
        this.total = parseFloat(deliveryTotal)
    };

    /*This calculates total delivery fees and how many of each type.  
    Called in the function calcTotals.*/
    function myFee (delvFee){
        if (delvFee === 2.25){
            nearDeliver += 1;
            nearDollar += 1.50;
        }
        else if (delvFee === 4.00){
            farDeliver += 1;
            farDollar += 3.25;
        }
        else {
            veryFarDeliver += 1;
            veryFarDollar += 4.25;
        }
    };

    /*This resets all totals for proper calculation when new data is added.
    Called in teh submit button event listener. */
    function resetTotals(){
        nearDeliver = 0;
        nearDollar = 0;
        farDeliver = 0;
        farDollar = 0;
        veryFarDeliver = 0;
        veryFarDollar = 0;
        totalDeliver = 0;
        ccGratuity = 0;
        totalCC = 0;
        cashGratuity = 0;
        totalCashOwed = 0;
        nightTotal = 0;
        delFee = 0;
    };

    // This calculates all totals and is called in the submit button event listener.
    function calcTotals (){
        for (let i = 0; i < deliveryList.length; i++){
            myFee(deliveryList[i].fee);

            if (deliveryList[i].payment === 'Cash'){
                cashGratuity += deliveryList[i].gratuity;
            }
            else{
                ccGratuity += deliveryList[i].gratuity;
            }
            totalCashOwed += deliveryList[i].total;
        }
        
        totalDeliver = nearDeliver + farDeliver + veryFarDeliver;
        totalDollar = nearDollar + farDollar +  veryFarDollar;
        totalFromCC = totalDollar + ccGratuity;
        nightTotal = totalFromCC + cashGratuity;
    };

    function changeHtml () {
        document.getElementById('nearDev').textContent = nearDeliver;
        document.getElementById('farDev').textContent = farDeliver;
        document.getElementById('veryFarDev').textContent = veryFarDeliver;
        document.getElementById('totalDev').textContent = totalDeliver;
        document.getElementById('nearTotal').textContent = formatter.format(nearDollar);
        document.getElementById('farTotal').textContent = formatter.format(farDollar);
        document.getElementById('veryFarTotal').textContent = formatter.format(veryFarDollar);
        document.getElementById('totalFees').textContent = formatter.format(totalDollar);
        document.getElementById('delFeeTotal').textContent = formatter.format(totalDollar);
        document.getElementById('ccGratuity').textContent = formatter.format(ccGratuity);
        document.getElementById('totalFromCC').textContent = formatter.format(totalFromCC);
        document.getElementById('ccTotal').textContent = formatter.format(totalFromCC);
        document.getElementById('cashGratuity').textContent = formatter.format(cashGratuity);
        document.getElementById('cashOwed').textContent = `- ${formatter.format(totalCashOwed)}`;
        document.getElementById('nightTotal').textContent = formatter.format(nightTotal);
    };  

    //Pops up the menu for adding an entry
    document.querySelector('#addEntry').onclick = () => {
        deliveries.style.display = 'none';
        addForm.style.display = 'block';
    };

    //Submits the delivery and closes menu for adding an entry
    document.querySelector('#submitDelivery').onclick = () => {
        
        deliveries.style.display = 'block';
        addForm.style.display = 'none';
        deliveryCount += 1;
        
        let delAddress = address.value;
        let delGratuity = gratuity.value;
        let delTotal = orderTotal.value;
        
        let template = `
        <tr>
        <td>${deliveryCount}</td>
        <td>${delAddress}</td>
        <td>${delPayment}</td>
        <td>${formatter.format(delTotal)}</td>
        <td>${formatter.format(delGratuity)}</td>
        <td>${formatter.format(delFee)}</td>
        </tr>
        `;
        
        table.innerHTML += template;
        const delivery1 = new Delivery(deliveryCount, delAddress, delFee, delPayment, delGratuity, delTotal);
        deliveryList.push(delivery1);
        document.getElementById('addForm').reset();
        calcTotals();
        changeHtml();
        resetTotals();
        
        
    };

    //Listens to see if near is checked and if so unchecks the far and very far
    nearBox.addEventListener('change', (n) => {
        if(n.target.checked){
            farBox.checked = false;
            veryFarBox.checked = false;
            delFee = 2.25
        }
    });

    //listens to see if far is checked an if so unchecks near and very far.
    farBox.addEventListener('change', (f) => {
        if(f.target.checked){
            nearBox.checked = false;
            veryFarBox.checked = false;
            delFee = 4.00
        }
    });

    //Listens for veryFar to be checked and if so unchecks far and near.
    veryFarBox.addEventListener('change', (v) => {
        if(v.target.checked){
            farBox.checked = false;
            nearBox.checked = false;
            delFee = 5.00
        }
    });

    //Listens for cash to be checked an if so unchecks cc and web.
    cashBox.addEventListener('change', (ca) =>{
        if(ca.target.checked){
            ccBox.checked = false;
            webBox.checked = false;
            totalOrder.style.display = 'block';
            delPayment = 'Cash';
        }
    });

    //Listens for cc to be checked and if so unchecks cash and web
    ccBox.addEventListener('change', (cc) =>{
        if(cc.target.checked){
            cashBox.checked = false;
            webBox.checked = false;
            totalOrder.style.display = 'none';
            delPayment = 'CC';
        }
    });

    //Listens for web to be checked and if so unchecks cc and cash.
    webBox.addEventListener('change', (w) =>{
        if(w.target.checked){
            ccBox.checked = false;
            cashBox.checked = false;
            totalOrder.style.display = 'none';
            delPayment = 'Web';
        }
    });

});


