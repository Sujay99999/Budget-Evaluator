// budget controller module. its a iife
//hello
var budgetController = (function()
{
   var Expenses = function(idArg, descriptionArg, valueArg){   // this is the function constructor for the expense object
       this.expid = idArg;
       this.expdescription = descriptionArg;
       this.expvalue = valueArg;
       this.percentage = -1;
   };

   Expenses.prototype.calcPerc = function(totalIncomeValue){

        if(totalIncomeValue > 0)
        {
            this.percentage = Math.round(((this.expvalue)/(totalIncomeValue))*100);
        }
   };

   Expenses.prototype.getPerc = function(){

        return this.percentage;

   }

   var Incomes = function(idArg, descriptionArg, valueArg){     // this is the function constructor for the income object
        this.incid = idArg;
        this.incdescription = descriptionArg;
        this.incvalue = valueArg;
    };
    
    var data = {                                                // this is an uniform data structure that contains all the info 
                                                                // required to be stored
        items: {
            expArr: [],
            incArr: []
        },
        total: {
            expTotal: 0,
            incTotal: 0, 
            finalTotal: 0,
            percentage: 0
        }
    };   

    var calculateFunc = function(typeArg)
    {
        var sum = 0;
        if(typeArg === 'exp')
        {
            for(var i=0;i< data.items.expArr.length; i++)
            {
                sum += data.items.expArr[i].expvalue;
            }
        }
        else
        {
            for(var i=0;i< data.items.incArr.length; i++)
            {
                sum += data.items.incArr[i].incvalue;
            }
        }
        return sum;
    };

    return{

        getBudget: function(){                                             // methos to return a customized object to the controller module
            
            return{

                budgetTotal: data.total.finalTotal,
                budgetIncTotal: data.total.incTotal,
                budgetExpTotal: data.total.expTotal,
                budgetPercentage: data.total.percentage
            };
        },

        addItemBdgt: function( typeArg, descriptionArg, valueArg){         // this is a public method to add the given data

            var objInstance, idArg;
            
            if(typeArg === 'exp')
            {
                if(data.items.expArr.length === 0)
                {
                    idArg = 1;
                }
                else
                {
                    idArg = data.items.expArr[data.items.expArr.length - 1].expid + 1;   //vvip logic to calculate the id
                }
                
                objInstance = new Expenses(idArg, descriptionArg, valueArg);
                data.items.expArr.push(objInstance);
                data.total.expTotal += valueArg;
            }
            else
            {
                if(data.items.incArr.length === 0)
                {
                    idArg = 1;
                }
                else
                {
                    idArg = data.items.incArr[data.items.incArr.length - 1].incid + 1;
                }
                objInstance = new Incomes(idArg, descriptionArg, valueArg);
                data.items.incArr.push(objInstance);
                data.total.incTotal += valueArg;

            }
            return objInstance;
        },

        deleteItemBdgt: function( typeArg, idArg){                          //method to delete the required element from the budget controller
            //the values are either 'income' and 'expense'
            if(typeArg === 'income')
            {
                for(var i=0;i< data.items.incArr.length;i++)
                {
                    if(data.items.incArr[i].incid === idArg)
                    {
                        data.items.incArr.splice(i, 1);                             // its not necessary to update the total value as we can
                    }                                                               // again call the calculate budget method
                }
            }
            else
            {
                for(var i=0;i< data.items.expArr.length;i++)
                {
                    if(data.items.expArr[i].expid === idArg)
                    {
                        data.items.expArr.splice(i, 1);
                    }
                }
            }

        },

        calculatePercentages: function(){

            data.items.expArr.forEach((element) => {element.calcPerc(data.total.incTotal);});
        },

        getPercentages: function(){

            var percentageArr = data.items.expArr.map( function(element)
            {
                return element.getPerc();
            } );
            return percentageArr;
        },

        calculateBudget: function(){                                   // this method is used during addition and deletion of the list item

            data.total.expTotal = calculateFunc('exp');
            data.total.incTotal = calculateFunc('inc');
            data.total.finalTotal = data.total.incTotal - data.total.expTotal;
            if(data.total.incTotal > 0)
            {
                data.total.percentage = Math.round(((data.total.expTotal)/(data.total.incTotal))*100);
            }
            else
            {
                data.total.percentage = -1;                                //this indicates that there is no income uptill this point
            }
        },

        
        testing: function(){                        // this method is only to make the private data var to be public and for testing purposes
            console.log(data); 
        }
        
    };

})();

// UI controller module. its a iife
var UIController = (function(){

    var DOMinUI = {                                                 // this is a private object of the class strings we are going to use              
        inputType: '.add__type',
        inputDescription:  '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        inputIncomeClass: '.income__list',
        inputExpenseClass: '.expenses__list',
        inputExpensePercentageClass: '.item__percentage',
        budgetLabel: '.budget__value',
        budgetIncLabel: '.budget__income--value',
        budgetExpLabel: '.budget__expenses--value',
        budgetPercentageLabel: '.budget__expenses--percentage',
        containerClass: '.container'
    };

    return{
        getInput: function()
        {
            return{
                type: document.querySelector(DOMinUI.inputType).value, // the type is either exp or inc
                description: document.querySelector(DOMinUI.inputDescription).value,
                value: parseFloat(document.querySelector(DOMinUI.inputValue).value) //convert the string into a float
            };
        },

        getDOMstrings: function(){                                  // this method of the object makes the DOMinUi exposed to public
            return DOMinUI;
        },

        clearUIFeilds: function(){                                  // this methos is to vlaer the input feilds of the ui

            var selectedFeilds, selectedFeildsArr;
            // step1: to select the required elements
            selectedFeilds =  document.querySelectorAll(DOMinUI.inputDescription + ',' + DOMinUI.inputValue);
            // step2: the selected feilds variable is a list, we need to convert it into an array
            selectedFeildsArr = Array.prototype.slice.call(selectedFeilds);
            //step3: each element of the array, its input feild must be erased
            selectedFeildsArr.forEach((element)=> {element.value = '';} ) //the value is modified wrt to the html document 
            selectedFeildsArr[0].focus();
        },

        addItemToUI: function(object, typeArg)                      // this method is used to add the input object to the interface
        {
            var htmlStr, newHtmlStr, objClass;
            if(typeArg === 'inc')
            {
                htmlStr = `
                <div class="item clearfix" id="income-%incid%">
                    <div class="item__description">%incdescription%</div>
                    <div class="right clearfix"><div class="item__value">%incvalue%</div>
                        <div class="item__delete">
                            <button class="item__delete--btn">
                                <i class="ion-ios-close-outline"></i>
                            </button>
                        </div>
                    </div>
                </div>`;
                newHtmlStr =  htmlStr.replace('%incid%', object.incid);
                newHtmlStr = newHtmlStr.replace('%incdescription%', object.incdescription);
                newHtmlStr = newHtmlStr.replace('%incvalue%', object.incvalue);
                document.querySelector(DOMinUI.inputIncomeClass).insertAdjacentHTML('beforeend', newHtmlStr);
            }
            else
            {
                htmlStr = `
                <div class="item clearfix" id="expense-%expid%">
                    <div class="item__description">%expdescription%
                    </div>
                    <div class="right clearfix"><div class="item__value">%expvalue%
                    </div>
                    <div class="item__percentage">21%</div><div class="item__delete">
                        <button class="item__delete--btn">
                            <i class="ion-ios-close-outline"></i>
                        </button>
                    </div>
                    </div>
                </div>`;
                newHtmlStr =  htmlStr.replace('%expid%', object.expid);
                newHtmlStr = newHtmlStr.replace('%expdescription%', object.expdescription);
                newHtmlStr = newHtmlStr.replace('%expvalue%', object.expvalue);
                document.querySelector(DOMinUI.inputExpenseClass).insertAdjacentHTML('beforeend', newHtmlStr);
            }
            
        },

        deleteItemFromUI: function( parentDOMSelector, childDOMSelector){ //method to delete the list from the ui

            parentDOMSelector.removeChild(childDOMSelector);

        },

        displayBudget: function(object){                                  //After calculating the budget, we need to display it on the ui

            document.querySelector(DOMinUI.budgetLabel).textContent = object.budgetTotal;
            document.querySelector(DOMinUI.budgetIncLabel).textContent = object.budgetIncTotal;
            document.querySelector(DOMinUI.budgetExpLabel).textContent = object.budgetExpTotal;
            if(object.budgetPercentage > 0)
            {
                document.querySelector(DOMinUI.budgetPercentageLabel).textContent = object.budgetPercentage;
            }
            else
            {
                document.querySelector(DOMinUI.budgetPercentageLabel).textContent = '---';
            }
        },

        displayPercentages: function(arr){

            var selectedNodesList = 
        }
    };
})();

// app controller module. its a iife
var appController = (function(bdgtctrl, UIctrl)
{
    var setupEventListeners = function()
    {
        var DOMinAppcontroller = UIctrl.getDOMstrings();
        document.querySelector(DOMinAppcontroller.inputBtn).addEventListener('click', ctlrAddItem);
        document.addEventListener('keypress', function(event)
        {
            if(event.keyCode === 13 || event.which === 13)
            {
                ctlrAddItem();
            }
        });
        document.querySelector(DOMinAppcontroller.containerClass).addEventListener('click', ctlrDelItem);
    }


    var updateBudget = function(){

        // step5: calculate the total income and expense as well as the total and the percent
        bdgtctrl.calculateBudget();
        // step6: get an new object exposing only few properties of the budget to the public, for the other modules
        var bdgtAppcontroller = bdgtctrl.getBudget();
        //step6: display the updated budget values to the ui
        UIctrl.displayBudget(bdgtAppcontroller);
        
    };

    var updatePercentages = function(){

        //step1: to claculate the percentages in the buget controller module
        bdgtctrl.calculatePercentages();
        //step2: to return the upadted percentages to the app controller module
        var percentageArrAppcontroller = bdgtctrl.getPercentages();
        console.log(percentageArrAppcontroller);
        //step3: to update the ui with the updated percentages

    }

    var ctlrDelItem = function(event){
                                                            // the problem occurs due to the different naming of the constructor properties
        // step1: to find the DOM node on which the event is being triggered
        var selectedItem = event.target.parentNode.parentNode.parentNode.parentNode;
        var selectedItemParent = event.target.parentNode.parentNode.parentNode.parentNode.parentNode;
        var selectedItemParentName = event.target.parentNode.parentNode.parentNode.parentNode.parentNode.className;
        var idArr, idArg, typeArg;
        // step2: delete the item from the budget controller
        if('.' + selectedItemParentName === UIctrl.getDOMstrings().inputIncomeClass)        //making sure that the classes are matching    
        {
            idArr = selectedItem.id.split('-');
            idArg = parseInt(idArr[1]);
            typeArg = idArr[0];
            bdgtctrl.deleteItemBdgt(typeArg, idArg);
        }
        else if('.' + selectedItemParentName === UIctrl.getDOMstrings().inputExpenseClass)  //making sure that the classes are matching
        {
            idArr = selectedItem.id.split('-');
            idArg = parseInt(idArr[1]) ;
            typeArg = idArr[0];
            bdgtctrl.deleteItemBdgt(typeArg, idArg);
        }
        // step3: delete the item from the ui controller
        UIctrl.deleteItemFromUI( selectedItemParent, selectedItem);
        // step4: update and display the budget
        updateBudget();
        updatePercentages();
    }

    var ctlrAddItem = function()                                            // better to put this iife under private stuff
    {
        var inputAppcontroller = UIctrl.getInput();                                      // step1: to get input form the user 

        if((inputAppcontroller.description !== '')&&(!isNaN(inputAppcontroller.value))&&(inputAppcontroller.value > 0)) 
                                                                                // we must have valid input feilds to proceed with other steps
        {
            var itemAppcontroller = bdgtctrl.addItemBdgt(inputAppcontroller.type, inputAppcontroller.description, inputAppcontroller.value);
                                                                                            // step2: to add the info to the budget controller
            UIctrl.addItemToUI(itemAppcontroller, inputAppcontroller.type);                 //step3: to add the onject to the UI

            UIctrl.clearUIFeilds();                                                         //step4: to clear the input feilds on the ui

            updateBudget();                                                                 //includes all the steps related to the budget
            updatePercentages();                                                         //includes all the steps related to the percentages
        }
        else
        {
            if(inputAppcontroller.description === '')
            {
                alert('Enter an valid Description');
            }
            else if(isNaN(inputAppcontroller.value))
            {
                alert('Enter an valid value');
            }
            else if(inputAppcontroller.value === 0)
            {
                alert('Enter the value other than 0');
            }
        }
    }

    return{

        init: function(){                                                   // creating an init function for the whole application
            console.log('the application has begun');
            setupEventListeners();
            UIctrl.displayBudget({budgetTotal: 0,budgetIncTotal: 0,budgetExpTotal: 0,budgetPercentage: 0})
                                    // initializing the Ui values to be 0. Here we are passing an object directly to the function
        }
    }

})(budgetController, UIController);

appController.init();                                                       // calling the init method...this is very much required to start
                                                                            // the application

