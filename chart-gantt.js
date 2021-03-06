// Generated by LiveScript 1.2.0
(function(){
  d3.gantt = function(){
    var gantt, FIT_TIME_DOMAIN_MODE, FIXED_TIME_DOMAIN_MODE, margin, timeDomainStart, timeDomainEnd, timeDomainMode, taskTypes, taskStatus, height, width, tickFormat, keyFunction, rectTransform, x$, x, y$, y, z$, xAxis, z1$, yAxis, brush, initTimeDomain, initAxis;
    gantt = function(tasks){
      var x$, body, y$, ganttChartGroup, z$, overlayGroup, z1$, eventGroup, z2$, z3$, z4$, z5$, z6$;
      initTimeDomain(tasks);
      initAxis();
      x$ = body = d3.select('body').append('svg');
      x$.attr('class', 'chart');
      y$ = ganttChartGroup = body.append('g');
      y$.attr('class', 'gantt-chart');
      z$ = overlayGroup = body.append('g');
      z$.attr('class', 'overlay');
      z1$ = eventGroup = body.append('g');
      z1$.attr('class', 'event');
      z2$ = d5([body, ganttChartGroup, overlayGroup, eventGroup]);
      z2$.attr('width', width + margin.left + margin.right);
      z2$.attr('height', height + margin.top + margin.bottom);
      z3$ = d5([ganttChartGroup, overlayGroup, eventGroup]);
      z3$.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
      z4$ = ganttChartGroup;
      z5$ = z4$.append('g');
      z5$.attr('class', 'x axis');
      z5$.attr('transform', 'translate(0, ' + height - margin.top - margin.bottom + ')');
      z5$.transition().call(xAxis);
      z6$ = z4$.append('g');
      z6$.attr('class', 'y axis');
      z6$.transition().call(yAxis);
      gantt.redraw(tasks);
      return gantt;
    };
    FIT_TIME_DOMAIN_MODE = 'fit';
    FIXED_TIME_DOMAIN_MODE = 'fixed';
    margin = {
      top: 10,
      right: 40,
      bottom: 15,
      left: 150
    };
    timeDomainStart = d3.time.day.offset(new Date, -3);
    timeDomainEnd = d3.time.hour.offset(new Date, +3);
    timeDomainMode = FIT_TIME_DOMAIN_MODE;
    taskTypes = [];
    taskStatus = [];
    height = document.body.clientHeight - margin.top - margin.bottom - 5;
    width = document.body.clientWidth - margin.right - margin.left - 5;
    tickFormat = '%H:%M';
    keyFunction = function(d){
      return d.startDate + d.taskName + d.endDate;
    };
    rectTransform = function(d){
      return 'translate(' + x(d.startDate) + ',' + y(d.taskName) + ')';
    };
    x$ = x = d3.time.scale();
    x$.domain([timeDomainStart, timeDomainEnd]);
    x$.range([0, width]);
    x$.clamp(true);
    y$ = y = d3.scale.ordinal();
    y$.domain(taskTypes);
    y$.rangeRoundBands([0, height - margin.top - margin.bottom], 0.1);
    z$ = xAxis = d3.svg.axis();
    z$.scale(x);
    z$.orient('bottom');
    z$.tickFormat(d3.time.format(tickFormat));
    z$.tickSubdivide(true);
    z$.tickSize(8);
    z$.tickPadding(8);
    z1$ = yAxis = d3.svg.axis();
    z1$.scale(y);
    z1$.orient('left');
    z1$.tickSize(0);
    brush = d3.svg.brush();
    initTimeDomain = function(tasks){
      if (timeDomainMode === FIT_TIME_DOMAIN_MODE) {
        if (tasks === undefined || tasks.length < 1) {
          timeDomainStart = d3.time.day.offset(new Date, -3);
          timeDomainEnd = d3.time.hour.offset(new Date, +3);
          return;
        }
        tasks.sort(function(a, b){
          return a.endDate - b.endDate;
        });
        timeDomainEnd = tasks[tasks.length - 1].endDate;
        tasks.sort(function(a, b){
          return a.startDate - b.startDate;
        });
        return timeDomainStart = tasks[0].startDate;
      }
    };
    initAxis = function(){
      var x$, y$, z$, z1$;
      x$ = x = d3.time.scale();
      x$.domain([timeDomainStart, timeDomainEnd]);
      x$.range([0, width]);
      x$.clamp(true);
      y$ = y = d3.scale.ordinal();
      y$.domain(taskTypes);
      y$.rangeRoundBands([0, height - margin.top - margin.bottom], 0.1);
      z$ = xAxis = d3.svg.axis();
      z$.scale(x);
      z$.orient('bottom');
      z$.tickFormat(d3.time.format(tickFormat));
      z$.tickSubdivide(true);
      z$.tickSize(8);
      z$.tickPadding(8);
      z1$ = yAxis = d3.svg.axis();
      z1$.scale(y);
      z1$.orient('left');
      z1$.tickSize(0);
      return z1$;
    };
    gantt.redraw = function(tasks){
      initTimeDomain(tasks);
      gantt.redrawMain(tasks);
      return gantt;
    };
    gantt.redrawMain = function(tasks){
      var svg, ganttChartGroup, eventGroup, rect, tooltipEventGroup, x$, y$;
      initAxis();
      svg = d3.select('svg');
      ganttChartGroup = svg.select('.gantt-chart');
      eventGroup = svg.select('.event');
      rect = ganttChartGroup.selectAll('.bar').data(tasks, keyFunction);
      tooltipEventGroup = eventGroup.selectAll('.tooltip-event').data([], keyFunction);
      tooltipEventGroup.exit().remove();
      x$ = rect.enter().insert('rect', ':first-child');
      x$.attr('rx', 5);
      x$.attr('ry', 5);
      x$.attr('class', function(d){
        if (taskStatus[d.status] === null) {
          return 'bar';
        }
        return 'bar ' + taskStatus[d.status];
      });
      y$ = rect.transition();
      y$.transition().attr('y', 0);
      y$.attr('transform', rectTransform);
      y$.attr('height', function(d){
        return y.rangeBand();
      });
      y$.attr('width', function(d){
        return x(d.endDate) - x(d.startDate);
      });
      rect.exit().remove();
      rect.on('mouseenter', function(e){
        var tooltipEventGroup, x$, y$, z$;
        tooltipEventGroup = eventGroup.selectAll('.tooltip-event').data([e], keyFunction);
        x$ = tooltipEventGroup.enter().append('g');
        y$ = x$.attr('class', 'tooltip-event');
        z$ = y$.append('rect');
        z$.attr('rx', 5);
        z$.attr('ry', 5);
        z$.attr('class', 'tooltip');
        z$.attr('transform', rectTransform);
        z$.attr('height', function(d){
          return y.rangeBand();
        });
        z$.attr('width', function(d){
          return x(d.endDate) - x(d.startDate);
        });
        x$.on('mouseover', function(e){
          var overlayGroup, tooltip, x$, y$;
          overlayGroup = svg.select('.overlay');
          tooltip = overlayGroup.selectAll('.tooltip').data([e], keyFunction);
          x$ = tooltip.enter().insert('rect', ':first-child');
          x$.attr('rx', 5);
          x$.attr('ry', 5);
          x$.attr('class', 'tooltip');
          y$ = tooltip.transition().attr('y', 0);
          y$.attr('transform', rectTransform);
          y$.attr('height', function(d){
            return y.rangeBand();
          });
          y$.attr('width', function(d){
            return x(d.endDate) - x(d.startDate);
          });
          return tooltip.exit().remove();
        });
        x$.on('mouseout', function(e){
          var overlayGroup, tooltip;
          overlayGroup = svg.select('.overlay');
          tooltip = overlayGroup.selectAll('.tooltip').data([], keyFunction);
          return tooltip.exit().remove();
        });
        return tooltipEventGroup.exit().remove();
      });
      return gantt;
    };
    gantt.margin = function(value){
      if (!arguments.length) {
        return margin;
      }
      margin = value;
      return gantt;
    };
    gantt.timeDomain = function(value){
      if (!arguments.length) {
        return [timeDomainStart, timeDomainEnd];
      }
      timeDomainStart = +value[0];
      timeDomainEnd = +value[1];
      return gantt;
    };
    gantt.timeDomainMode = function(value){
      if (!arguments.length) {
        return timeDomainMode;
      }
      timeDomainMode = value;
      return gantt;
    };
    gantt.taskTypes = function(value){
      if (!arguments.length) {
        return taskTypes;
      }
      taskTypes = value;
      return gantt;
    };
    gantt.taskStatus = function(value){
      if (!arguments.length) {
        return taskStatus;
      }
      taskStatus = value;
      return gantt;
    };
    gantt.width = function(value){
      if (!arguments.length) {
        return width;
      }
      width = +value;
      return gantt;
    };
    gantt.height = function(value){
      if (!arguments.length) {
        return height;
      }
      height = +value;
      return gantt;
    };
    gantt.tickFormat = function(value){
      if (!arguments.length) {
        return tickFormat;
      }
      tickFormat = value;
      return gantt;
    };
    return gantt;
  };
}).call(this);
