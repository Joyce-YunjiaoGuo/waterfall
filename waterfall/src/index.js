(function() {
    var oLi = document.getElementsByTagName('li');
    var itemWidth = 200;
    var page = 1;
    var lock = true;
    function getData() {
        if(lock) {
            lock = false;
            ajax('GET', './src/getPics.php', 'capge=' + page, addDom, true);
            page++
        }
        
    }
    getData();
    function addDom(data) {
        var dataArray = JSON.parse(data);
        
        dataArray.forEach(function(ele, index) {
            if(ele.width != 0 && ele.height != 0) {
                var oItem = document.createElement('div');
                var oBox = document.createElement('div');
                var oImg = new Image();
                var oP = document.createElement('p');
                var minIndex = calMinLi(oLi);

                oItem.className = 'item';
                oBox.className = 'box';

                oImg.src = ele.preview;
                oP.innerText = ele.title;
                oImg.style.width = itemWidth + 'px';
                oImg.style.height = ele.height / ele.width * itemWidth + 'px';

                oBox.appendChild(oImg);
                oItem.appendChild(oBox);
                oItem.appendChild(oP);
                oLi[minIndex].appendChild(oItem);
            }
            
        })
        lock = true;
    }
    function calMinLi(dom) {
        var index = 0;
        var minHeight = dom[0].offsetHeight;
        for(var i=1; i<dom.length; i++) {
            if(dom[i].offsetHeight < minHeight) {
                minHeight = dom[i].offsetHeight;
                index = i;
            }
        }
        return index;
    }
    document.onscroll = function() {
        var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        var viewHeight = document.documentElement.clientHeight || document.body.clientHeight;
        var liHeight = oLi[calMinLi(oLi)].offsetHeight;

        if(liHeight < scrollHeight + viewHeight) {
            getData();
        }
    }










    function ajax(method, url, data, callback, flag) {
        var xhr = null;
        if(window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        }else {
            xhr = new ActiveXObject('Microsoft.XMLHttp');
        }
        method = method.toUpperCase();
        if(method == 'GET') {
            xhr.open(method, url + '?' + data, flag);
            xhr.send();
        }else if(method == 'POST') {
            xhr.open(method, url, flag);
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.send(data);
        }
        xhr.onreadystatechange = function() {
            if(xhr.readyState == 4) {
                if(xhr.status == 200) {
                    callback(xhr.response);
                }
            }
        }
    }

})()