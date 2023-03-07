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
    let cashTipOnCC = false;
    
    const deliveries = document.getElementById('deliveries');
    const addForm = document.getElementById('addForm');
    const nearBox = document.getElementById('near');
    const farBox = document.getElementById('far');
    const veryFarBox = document.getElementById('veryFar');
    const cashBox = document.getElementById('cash');
    const ccBox = document.getElementById('cc');
    const webBox = document.getElementById('web');
    const tipBox = document.getElementById('tipType');
    const totalOrder = document.querySelector('.totalOrder');
    const address = document.getElementById('address');
    const gratuity = document.getElementById('gratuity');
    const orderTotal = document.getElementById('orderTotal');
    const table = document.getElementById('deliver');
    const deliveryList = [];
    const regex = /[0-9]+\.[0-9]{2}/;
    
    //This will ensure there are two decimal places for dollar amounts.
    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits:2,
    });
    
    //This creates a Delivery object
    function Delivery (deliveryStop, deliveryAddress, deliveryFee, deliveryPayment, deliveryGratuity, deliveryTotal, deliveryTipType) {
        this.stop = deliveryStop, 
        this.address = deliveryAddress, 
        this.fee = deliveryFee, 
        this.payment = deliveryPayment, 
        this.gratuity = parseFloat(deliveryGratuity),
        this.total = parseFloat(deliveryTotal)
        this.tipType = deliveryTipType;
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
        cashTipOnCC = false;
    };

    // This calculates all totals and is called in the submit button event listener.
    // A true tipType indicates cash tip
    function calcTotals (){
        for (let i = 0; i < deliveryList.length; i++){
            myFee(deliveryList[i].fee);

            if (deliveryList[i].payment === 'Cash'){
                cashGratuity += deliveryList[i].gratuity;
            }
            else if  (deliveryList[i].tipType === true){
                cashGratuity += deliveryList[i].gratuity;
            }
            else{
                ccGratuity += deliveryList[i].gratuity;
            }
            if (isNaN(deliveryList[i].total) === false){
                totalCashOwed += deliveryList[i].total;
            }
        }
        
        totalDeliver = nearDeliver + farDeliver + veryFarDeliver;
        totalDollar = nearDollar + farDollar +  veryFarDollar;
        totalFromCC = totalDollar + ccGratuity;
        nightTotal = totalFromCC + cashGratuity;
    };

    //This populates the respective html element with calculations.
    //It is called in the submit button event listener.
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

    //Stores the deliveryList array in localStorage.
    //It is called in the submit button event listener
    function storeIt () {
        const arrayToStore = JSON.stringify(deliveryList);
        localStorage.setItem('array', arrayToStore);
    };

    //Pops up the menu for adding an entry
    document.querySelector('#addEntry').onclick = () => {
        deliveries.style.display = 'none';
        addForm.style.display = 'block';
    };

    //Clears the HTML of deliveries
    document.querySelector('#endNight').onclick = () => {
        Swal.fire({
            title: 'This will erase all data!',
            text: 'Do you want to continue?',
            icon: 'warning',
            showDenyButton: true, 
            confirmButtonText: 'Continue',
            denyButtonText: 'Abort',
        }).then ((result) => {
            if (result.isConfirmed){
                Swal.fire('Delivery Tracker has been reset!', '', 'success');
                resetTotals();
                deliveryCount = 0;
                localStorage.clear();
                table.innerHTML = `
                        <tr>
                            <th>No.</th>
                            <th>Street</th>
                            <th>Type</th>
                            <th>Total</th>
                            <th>Tip</th>
                            <th>Fee</th>
                        </tr>
                        `;
        
                document.getElementById('nearDev').textContent = '0';
                document.getElementById('farDev').textContent = '0';
                document.getElementById('veryFarDev').textContent = '0';
                document.getElementById('totalDev').textContent = '0';
                document.getElementById('nearTotal').textContent = '0.00';
                document.getElementById('farTotal').textContent = '0.00';
                document.getElementById('veryFarTotal').textContent = '0.00';
                document.getElementById('totalFees').textContent = '0.00';
                document.getElementById('delFeeTotal').textContent = '0.00';
                document.getElementById('ccGratuity').textContent = '0.00';
                document.getElementById('totalFromCC').textContent = '0.00';
                document.getElementById('ccTotal').textContent ='0.00';
                document.getElementById('cashGratuity').textContent = '0.00';
                document.getElementById('cashOwed').textContent = `- 0.00`;
                document.getElementById('nightTotal').textContent = '0.00';

                window.location.reload();
            }
            else if (result.isDenied){
                Swal.fire('Aborted!', 'Your data will not be deleted.', 'info');
            };
        });
    };
    
    //Submits the delivery and closes menu for adding an entry
    document.querySelector('#submitDelivery').onclick = () => {
        if (nearBox.checked == false && farBox.checked == false && veryFarBox.checked == false){
            Swal.fire('Please choose a delivery fee!', '', 'error');
            return false;
        }
        
        if (cashBox.checked == false && ccBox.checked == false && webBox.checked == false){
            Swal.fire('Please choose a payment type!', '', 'error');
            return false;
        }
        

        if (regex.test(gratuity.value)){
            if (cashBox.checked){
                if(regex.test(orderTotal.value)){
                    let span = document.createElement('span');
                    span.innerHTML= `Address: ${address.value}<br> Payment Type: ${delPayment}<br> Order Total (cash only): ${formatter.format(orderTotal.value)}<br> Gratuity: ${formatter.format(gratuity.value)}<br> Deliver Fee: ${formatter.format(delFee)}`,
                    Swal.fire({
                        title: 'Is the following correct?',
                        html: span,
                        icon: 'question', 
                        showDenyButton: true, 
                        confirmButtonText: 'Yes', 
                        denyButtonText: 'No', 
                    }).then ((result) =>{
                        if (result.isConfirmed){
                            Swal.fire('Entry has been added', '', 'info');
                            deliveries.style.display = 'block';
                            addForm.style.display = 'none';
                            totalOrder.style.display = 'none';
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
                            const delivery1 = new Delivery(deliveryCount, delAddress, delFee, delPayment, delGratuity, delTotal, cashTipOnCC );
                            deliveryList.push(delivery1);
                            document.getElementById('addForm').reset();
                            storeIt();
                            calcTotals();
                            changeHtml();
                            resetTotals();
                        }
                        else if (result.isDenied){
                            Swal.fire('Entry cancelled', '', 'info');
                        };
                    });

                }
                else {
                    Swal.fire('Please enter a valid dollar amount. Ex: (3.00 or 3.26)', '', 'error');
                }
            }
            else {
                let span = document.createElement('span');
                span.innerHTML= `Address: ${address.value}<br> Payment Type: ${delPayment}<br> Order Total (cash only): ${formatter.format(orderTotal.value)}<br> Gratuity: ${formatter.format(gratuity.value)}<br> Deliver Fee: ${formatter.format(delFee)}`,
                Swal.fire({
                    title: 'Is the following correct?',
                    html: span,
                    icon: 'question', 
                    showDenyButton: true, 
                    confirmButtonText: 'Yes', 
                    denyButtonText: 'No', 
                }).then ((result) =>{
                    if (result.isConfirmed){
                        Swal.fire('Entry has been added', '', 'info');
                            if (tipBox.checked === true){
                                cashTipOnCC = true;
                            }
        
                            deliveries.style.display = 'block';
                            addForm.style.display = 'none';
                            totalOrder.style.display = 'none';
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
                            const delivery1 = new Delivery(deliveryCount, delAddress, delFee, delPayment, delGratuity, delTotal, cashTipOnCC);
                            deliveryList.push(delivery1);
                            document.getElementById('addForm').reset();
                            storeIt();
                            calcTotals();
                            changeHtml();
                            resetTotals();
                    }
                    else if (result.isDenied){
                        Swal.fire('Entry cancelled', '', 'info');
                    };
                });
            }

        }
        else {
            Swal.fire('Please enter a valid dollar amount. Ex: (3.00 or 3.26)', '', 'error');
        };
        
        
        
        
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
            tipBox.checked = true;
            ccBox.checked = false;
            webBox.checked = false;
            totalOrder.style.display = 'block';
            delPayment = 'Cash';
        }
    });

    //Listens for cc to be checked and if so unchecks cash and web
    ccBox.addEventListener('change', (cc) =>{
        if(cc.target.checked){
            tipBox.checked = false;
            cashBox.checked = false;
            webBox.checked = false;
            totalOrder.style.display = 'none';
            delPayment = 'CC';
        }
    });

    //Listens for web to be checked and if so unchecks cc and cash.
    webBox.addEventListener('change', (w) =>{
        if(w.target.checked){
            tipBox.checked = false;
            ccBox.checked = false;
            cashBox.checked = false;
            totalOrder.style.display = 'none';
            delPayment = 'Web';
        }
    });

    //Retrieves the string from localStorage and converts it into an array.
    //It is then pushed into the deliveryList array.  Each object is added to 
    //HTML.  It is called in the init function
    function retrieveFromStorage () {
        let retrievedObject = localStorage.getItem('array');
        if (retrievedObject !== null){
            let deliveryObjects = JSON.parse(retrievedObject);
            for (let i = 0; i < deliveryObjects.length; i++){
                deliveryCount += 1;
                deliveryList.push(deliveryObjects[i]);
    
                let template = `
                            <tr>
                            <td>${deliveryCount}</td>
                            <td>${deliveryObjects[i].address}</td>
                            <td>${deliveryObjects[i].payment}</td>
                            <td>${formatter.format(deliveryObjects[i].total)}</td>
                            <td>${formatter.format(deliveryObjects[i].gratuity)}</td>
                            <td>${formatter.format(deliveryObjects[i].fee)}</td>
                            </tr>
                            `;
                            
                table.innerHTML += template;
            }
            console.log(deliveryList);
            calcTotals();
            changeHtml();
            resetTotals();
        };
        
    };

    //This function is called when the page initializes.
    function init () {
        retrieveFromStorage();
    };

    init();
});


