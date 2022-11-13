
//When the body loads, call welcome() to set/retreive cookie to fetch the name
function welcome()
{

    var contents = "";
    var now = new Date();
    var hour = now.getHours();
    var name;
    //set expiry to 6 months
    var expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 6);

    if(hour <12)
    {
        contents+="<h2>Good Morning ";
    }

    //if hour is 13 upto 18, display Afternoon - Else if 18 or more - Display Good evening.
    else
    {
        hour-=12;
        if(hour<6)
        contents+="<h2>Good Afternoon ";
        else
        contents+="<h2>Good Evening ";
    }

    //fetch cookie info 
    if (getCookie("name") !== null)
    {
        name = getCookie("name");
    }
    else 
    {
        //if name key is null or empty or not defined, then ask for new name.
        while (name === "" || name === null || name === undefined) 
        {
            name = window.prompt("What's your name?", "Tom");
            document.cookie = "name=" + escape(name) + "; expires=" + expiryDate;
        }
    }

    contents+=name + ", welcome to CS Department Survey Form!</h2>";
    contents+="<a href = 'javascript:wrongName()'> " + "Click here if you are not " + name + "</a>";

    document.getElementById("welcomeMessage").innerHTML = contents;
}

//perform necessary split and fetch value for name.
function getCookie(name)
{
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts[1].split(";")[0];
    else return null;
}

//If wrong person's name is present, then delete cookie and force reload.
function wrongName()
    {
        document.cookie= "name=null;" + " expires=Thu, 01-Jan-95 00:00:01 GMT";
        location.reload();
    }


//calculate average and max after splitting usung comma delimiter.
function computeAvgMax()
{
     if(document.getElementById("data").value=="")
     {
        document.getElementById("wrongInput").innerHTML="";
        document.getElementById("average").innerHTML="";
        document.getElementById("maximum").innerHTML="";
     }
     else
     {
         var sum = 0;
         var average = 0;
         var max = 0;
         var dataList = document.getElementById("data").value.split(",");
         if(dataList.length<10)
         {
            document.getElementById("wrongInput").innerHTML="Error: Enter minimum 10 numbers separated by comma ranging from 1 to 100";
            document.getElementById("average").innerHTML="";
            document.getElementById("maximum").innerHTML="";
            return;
        }
         else
         {
             for(var i=0;i<dataList.length;i++)
             {
                //if entered value is not according to requirements, then display error message.
                if(isNaN(dataList[i]) || dataList[i]=="" || dataList[i]<1 || dataList[i]>100)
                {
                document.getElementById("wrongInput").innerHTML="Error: Enter numbers only between 1 to 100 separated comma.";
                document.getElementById("average").innerHTML="";
                document.getElementById("maximum").innerHTML="";
                return;
                }
                document.getElementById("wrongInput").innerHTML="";
             }

             for(var i=0;i<dataList.length;i++)
             {
                 if(parseFloat(dataList[i])>parseFloat(max))
                 max = dataList[i];
             }

             for(var i=0;i<dataList.length;i++)
             {
             sum = sum + parseFloat(dataList[i]);
             }
            
             average = sum/dataList.length;

             document.getElementById("average").innerHTML=average;
             document.getElementById("maximum").innerHTML=max;
         }
     }
}

function validate()
{
    var flag = true;
    //Username must be only alphabets - used Regex
    if(!document.getElementById("Username").value.match(/^[A-Z]+$/i))
    {
        document.getElementById("Username").value = "";
        showDialog();
        flag = false;
    }
    //Street address must be numbers or alphabets. space allowed.
    if(!document.getElementById("Street_Address").value.match(/^[a-z0-9 ]+$/i))
    {
        document.getElementById("Street_Address").value ="";
        showDialog();
        flag = false;
    }

    var checkedButtons=document.getElementsByName("ThingsLiked");
    var counter = 0;

    //to check number of selections.
    for(var i=0;i<checkedButtons.length;i++)
    {
        if(checkedButtons[i].checked==true)
        {
          counter++;
        }
    }

    if(counter<2)
    { 
        flag = false;
        showDialog();
        for(var i=0;i<checkedButtons.length;i++)
        document.getElementsByName("ThingsLiked")[i].checked=false;
        
    }

    var radioButtons=document.getElementsByName("Interest");
    var counter2 = 0;
    for(var i=0;i<radioButtons.length;i++)
    {
        if(radioButtons[i].checked==true)
        {
          counter2++;
        }
    }

    if(counter2==0)
    { 
        flag = false;
        showDialog();
    }


    //Email Regex to check if entered value is ok.
    if(!document.getElementById("email").value.match(/^[0-9A-Z+-._%]+@[0-9A-Z.-]+\.[A-Z]{2,63}$/i))
    {
      document.getElementById("email").value="";
      showDialog();
      flag = false;
    }

    return flag;
}


//Jquery Modal Dialog box, with bounce effect.
function showDialog () {
    $( "#formatError" ).dialog({ 
        autoOpen: true,
        modal: true,
        width: 500,
        height: 250,
        
        buttons: {
        "Ok": function() {
        $( this ).dialog( "close" );
        },
        },
        show: {
        effect: "bounce",
        duration: 1500
        },
        hide: {
        effect: "fade",
        duration: 1000
        }
    });
}

//Resets the span elements explicitly.
function resetForm()
{
    document.getElementById("average").innerHTML="";
    document.getElementById("maximum").innerHTML="";
    document.getElementById("state").innerHTML="";
    document.getElementById("city").innerHTML="";
}

var asyncRequest;

//Ajax call to read data from zip.json using XMLHttpRequest()
function validateZip()
{

    if(document.getElementById("zip").value == "")
    {
        document.getElementById("wrongZip").innerHTML =  "";
        document.getElementById("city").innerHTML="";
        document.getElementById("state").innerHTML="";
        return;
    }
    try
    {
        asyncRequest=new XMLHttpRequest();
        asyncRequest.onreadystatechange = stateChange;
        asyncRequest.open('GET',"zip.json",true);
        asyncRequest.send(null);
    }

    catch(exception)
    {
        alert("Request failed.");
    }

}

function stateChange()
{

  var flag=0;

  //If request is completed successfully, fetch the corresponding City and State
  if(asyncRequest.readyState==4 && asyncRequest.status==200)
  {

    var user_zipcode=document.getElementById("zip").value;

    var response=asyncRequest.responseText;
    var response_obj=JSON.parse(response);

    for(var x in response_obj.zipcodes)
    {
      if(response_obj.zipcodes[x].zip==user_zipcode)
      {
        document.getElementById("city").innerHTML=response_obj.zipcodes[x].city;
        document.getElementById("state").innerHTML=response_obj.zipcodes[x].state;
        document.getElementById("wrongZip").innerHTML =  "";
        flag = 1;
        break;
      }
    }

    //If zipcode is not present in the zip.json file, display error message.
    if(flag == 0)
      {
        document.getElementById("city").innerHTML="";
        document.getElementById("state").innerHTML="";
        document.getElementById("zip").value="";
        document.getElementById("wrongZip").innerHTML = "Error: Zip not found. Enter allowed values.";
      }
    }
  }
