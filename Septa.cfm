<html ng-app="appSepta">
<head>
    <title>Septa Train Check App</title>
</head>
<body>
    xfghsfdhhg
    <div ng-controller="MainController">
        <textarea ng-model="message" cols="40" rows="10"></textarea>
        <p>Number of characters left: <span ng-bind="left()"></span></p>            
    </div>
    
<script src="//cdnjs.cloudflare.com/ajax/libs/angular.js/1.4.8/angular.min.js"></script>
<script src="app.js"></script>
<script src="Controllers/MainController.js"></script>
</body>
</html>