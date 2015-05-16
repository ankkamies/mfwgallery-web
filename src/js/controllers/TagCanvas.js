'use strict';

module.exports = function($scope, postService) {
  $scope.tag = {};
  $scope.tags = [];
  $scope.newTag = '';

  $scope.selectedTags = [];

  var c = document.getElementById("tagCanvas");
  var ctx = c.getContext("2d");

  var dragCircle;
  var mouseOverCircle;

  postService.fetchTags();

  $scope.$on('postService:refresh', function() {
    postService.fetchTags();
  });

  $scope.$on('postService:refreshTags', function() {
    $scope.tags = postService.returnTags();
    for ($scope.tag in $scope.tags) {
      $scope.addCircle($scope.tags[$scope.tag]);
    }
  });

  $scope.removeTag = function(tag) {
    $scope.addCircle(tag);
    $scope.tags.push(tag);
    var index = $scope.selectedTags.indexOf(tag);
    $scope.selectedTags.splice(index, 1);
    $scope.post.tags.splice(index, 1);
  }

  function random(min,max) {
    return Math.floor((Math.random() * max) + min);
  }

  $scope.addCircle = function(tag) {
    tag.posX = random(1,400);
    tag.posY = random(1,200);

    var h = c.height / 2;
    var w = c.width / 2;
    var dir = Math.atan2(h - tag.posY, w - tag.posX);
    tag.speedX = 10 * Math.cos(dir);
    tag.speedY = 10 * Math.sin(dir);
    tag.radius = 10 + tag.posts.length*5;
    tag.color = 'blue';
    tag.hasCollided = false;

    tag.move = function () {
      tag.posX += tag.speedX;
      tag.posY += tag.speedY;
      tag.speedX *= 0.7;
      tag.speedY *= 0.7;
    };

    tag.draw = function () {
      ctx.beginPath();
      ctx.arc(tag.posX, tag.posY, tag.radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = tag.color;
      ctx.fill();

      ctx.lineWidth = 2;
      ctx.strokeStyle = '#003300';
      ctx.stroke();
    };

    tag.drawInfo = function () {
      ctx.font = '15pt Calibri';
      ctx.fillStyle = 'blue';
      ctx.textAlign = 'center';
      ctx.fillText(tag.text, tag.posX, tag.posY);
    };
  };

  $scope.sendTag = function () {
    postService.sendTag($scope.newTag,
      function(err) {
        if (err !== null) {
          console.log(err);
        } else {
          postService.fetchTags();
          $scope.newTag = null;
        }
      });
  };

    var dragCircle;
    var mouseOverCircle;

    function getMousePos(canvas, evt) {
      var rect = canvas.getBoundingClientRect();
      return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
      };
    }

    c.addEventListener('mousemove', function(evt) {
      var mousePos = getMousePos(c, evt);
      if (dragCircle) {
        dragCircle.posX = mousePos.x;
        dragCircle.posY = mousePos.y;
      }

     for ($scope.tag in $scope.tags) {
      var dist = Math.sqrt(Math.pow($scope.tags[$scope.tag].posX - mousePos.x, 2) + Math.pow($scope.tags[$scope.tag].posY - mousePos.y, 2));
      if (dist < $scope.tags[$scope.tag].radius) {
        $scope.tags[$scope.tag].color = 'red';
        $scope.tags[$scope.tag].mouseOver = true;
      } else {
        $scope.tags[$scope.tag].color = 'green';
        $scope.tags[$scope.tag].mouseOver = false;
      }
    }

  }, false);

    c.addEventListener('click', function(evt) {
     var mousePos = getMousePos(c, evt);
     for ($scope.tag in $scope.tags) {
      var dist = Math.sqrt(Math.pow($scope.tags[$scope.tag].posX - mousePos.x, 2) + Math.pow($scope.tags[$scope.tag].posY - mousePos.y, 2));
      if (dist < $scope.tags[$scope.tag].radius) {
        console.log($scope.tags[$scope.tag].text);
      } else {

      }
    }
  }, false);

    c.addEventListener('dblclick', function(evt) {
     var mousePos = getMousePos(c, evt);
     for ($scope.tag in $scope.tags) {
      var dist = Math.sqrt(Math.pow($scope.tags[$scope.tag].posX - mousePos.x, 2) + Math.pow($scope.tags[$scope.tag].posY - mousePos.y, 2));
      if (dist < $scope.tags[$scope.tag].radius) {
        console.log($scope.selectedTags);
        $scope.post.tags.push($scope.tags[$scope.tag].text);
        $scope.selectedTags.push({text: $scope.tags[$scope.tag].text, posts: $scope.tags[$scope.tag].posts});
        $scope.tags.splice($scope.tag, 1);
        $scope.$apply();
      } else {

      }
    }
  }, false);

    c.addEventListener('mousedown', function(evt) {
      console.log("hold");

      var mousePos = getMousePos(c, evt);

      for ($scope.tag in $scope.tags) {
        var dist = Math.sqrt(Math.pow($scope.tags[$scope.tag].posX - mousePos.x, 2) + Math.pow($scope.tags[$scope.tag].posY - mousePos.y, 2));
        if (dist < $scope.tags[$scope.tag].radius) {
          dragCircle = $scope.tags[$scope.tag];
        }
      }
    }, false);

    c.addEventListener('mouseup', function(evt) {
      console.log("release");
      if (dragCircle) {
        dragCircle = null;    
      }
    }, false);


  function detectCollision(c1, c2) {
    var dist = Math.sqrt(Math.pow(c1.posX - c2.posX, 2) + Math.pow(c1.posY - c2.posY, 2));

    var delta_x = c2.posX - c1.posX;
    var delta_y = c2.posY - c1.posY;
    var dir = Math.atan2(delta_y, delta_x);

    if(dist < c1.radius + c2.radius) {
      dist = Math.abs(dist - (c1.radius + c2.radius)) / 10;

        c2.speedX = dist * Math.cos(dir);
        c2.speedY = dist * Math.sin(dir);

        dir = -dir;

        c1.speedX = dist * Math.cos(dir);
        c1.speedY = dist * Math.sin(dir);

    }
  };

  function applyGravitationalPull() {
    for ($scope.tag in $scope.tags) {
      var h = c.height / 2;
      var w = c.width / 2;
      var c1 = $scope.tags[$scope.tag];
      var dir = Math.atan2(h - c1.posY, w - c1.posX);
      var dist = Math.sqrt(Math.pow(c1.posX - w, 2) + Math.pow(c1.posY - h, 2));
      if (dist < 10) {
        $scope.tags[$scope.tag].speedX = 0;
        $scope.tags[$scope.tag].speedY = 0;
      } else {
      $scope.tags[$scope.tag].speedX = dist/100 * Math.cos(dir);
      $scope.tags[$scope.tag].speedY = dist/100 * Math.sin(dir);        
      }

    }
  };

  function detectCollisions() {
    for ($scope.tag in $scope.tags) {
      for ($scope.tag2 in $scope.tags) {
        if ($scope.tag != $scope.tag2) {
          detectCollision($scope.tags[$scope.tag], $scope.tags[$scope.tag2]);
        }
      }
    }
  };

  function drawCircles() {
    ctx.clearRect (0 ,0 , c.width, c.height);
    for ($scope.tag in $scope.tags) {
      if ($scope.tags[$scope.tag] != dragCircle) {
        $scope.tags[$scope.tag].move();
        $scope.tags[$scope.tag].draw();
      }
      if ($scope.tags[$scope.tag].mouseOver) {
        mouseOverCircle = $scope.tags[$scope.tag];
      }
      $scope.tags[$scope.tag].hasCollided = false;
    }
  };

  detectCollisions();
  drawCircles(); 

  function update() {
    applyGravitationalPull();
    detectCollisions();
    drawCircles();

    if (dragCircle) {
      dragCircle.draw();
    }

    if (mouseOverCircle) {
      mouseOverCircle.drawInfo();
      mouseOverCircle = null;
    }

    setTimeout(update,10);
  };

  update();

};