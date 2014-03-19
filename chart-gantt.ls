d3.gantt = ->
  gantt = (tasks) ->
    initTimeDomain tasks
    initAxis!
    body = d3.select 'body' .append 'svg' 
      ..attr 'class' 'chart' 
    ganttChartGroup = body.append 'g' 
      ..attr 'class' 'gantt-chart' 
    overlayGroup = body.append 'g' 
      ..attr 'class' 'overlay' 	
    eventGroup = body.append 'g' 
      ..attr 'class' 'event' 

    d5 [body, ganttChartGroup, overlayGroup, eventGroup]
      ..attr 'width' (width + margin.left + margin.right)
      ..attr 'height' (height + margin.top + margin.bottom)

    d5 [ganttChartGroup, overlayGroup, eventGroup]
      ..attr 'transform' ('translate(' + margin.left + ', ' + margin.top + ')')
    
    ganttChartGroup
      ..append 'g'
        ..attr 'class' 'x axis'
        ..attr 'transform' ('translate(0, ' + height - margin.top - margin.bottom + ')')
        ..transition!.call xAxis
      ..append 'g'
        ..attr 'class' 'y axis'
        ..transition!.call yAxis
    
    gantt.redraw tasks
    gantt
  
  FIT_TIME_DOMAIN_MODE = 'fit'
  FIXED_TIME_DOMAIN_MODE = 'fixed'
  
  margin = {
    top: 10
    right: 40
    bottom: 15
    left: 150
  }
  
  timeDomainStart = d3.time.day.offset (new Date), -3
  timeDomainEnd = d3.time.hour.offset (new Date), +3
  timeDomainMode = FIT_TIME_DOMAIN_MODE
  taskTypes = []
  taskStatus = []
  height = document.body.clientHeight - margin.top - margin.bottom - 5
  width = document.body.clientWidth - margin.right - margin.left - 5
  tickFormat = '%H:%M'
  
  keyFunction = (d) -> d.startDate + d.taskName + d.endDate
  
  rectTransform = (d) -> 'translate(' + (x d.startDate) + ',' + (y d.taskName) + ')'
  
  x = d3.time.scale!
    ..domain [timeDomainStart, timeDomainEnd]
    ..range [0, width]
    ..clamp true
  y = d3.scale.ordinal!
    ..domain taskTypes
    ..rangeRoundBands [0, height - margin.top - margin.bottom] 0.1

  xAxis = d3.svg.axis!
    ..scale x
    ..orient 'bottom'
    ..tickFormat d3.time.format tickFormat
    ..tickSubdivide true
    ..tickSize 8
    ..tickPadding 8
  yAxis = d3.svg.axis!
    ..scale y
    ..orient 'left'
    ..tickSize 0
  brush = d3.svg.brush!
    
  initTimeDomain = (tasks) ->
    if timeDomainMode is FIT_TIME_DOMAIN_MODE
      if tasks is ``undefined`` or tasks.length < 1
        timeDomainStart := d3.time.day.offset (new Date), -3
        timeDomainEnd := d3.time.hour.offset (new Date), +3
        return 
      tasks.sort ((a, b) -> a.endDate - b.endDate)
      timeDomainEnd := tasks[tasks.length - 1].endDate
      tasks.sort ((a, b) -> a.startDate - b.startDate)
      timeDomainStart := tasks.0.startDate
  
  initAxis = ->
    x := d3.time.scale!
      ..domain [timeDomainStart, timeDomainEnd]
      ..range [0, width]
      ..clamp true
    y := d3.scale.ordinal!
      ..domain taskTypes
      ..rangeRoundBands [0, height - margin.top - margin.bottom], 0.1
    xAxis := d3.svg.axis!
      ..scale x
      ..orient 'bottom'
      ..tickFormat d3.time.format tickFormat
      ..tickSubdivide true
      ..tickSize 8
      ..tickPadding 8
    yAxis := d3.svg.axis!
      ..scale y
      ..orient 'left'
      ..tickSize 0
  
  gantt.redraw = (tasks) ->
    initTimeDomain tasks
    gantt.redrawMain tasks
    gantt
  
  gantt.redrawMain = (tasks) ->
    initAxis!
    svg = d3.select 'svg'
    ganttChartGroup = svg.select '.gantt-chart'
    eventGroup = svg.select '.event'
    rect = (ganttChartGroup.selectAll '.bar').data tasks, keyFunction
    tooltipEventGroup = (eventGroup.selectAll '.tooltip-event').data [], keyFunction
    tooltipEventGroup.exit!.remove! 

    rect.enter!.insert 'rect' ':first-child' 
      ..attr 'rx' 5 
      ..attr 'ry' 5 
      ..attr 'class' (d) ->
        return 'bar' if taskStatus[d.status] is null
        'bar ' + taskStatus[d.status]
    rect.transition!
      ..transition!.attr 'y' 0
      ..attr 'transform' rectTransform
      ..attr 'height' (d) -> 
        y.rangeBand!
      ..attr 'width' (d) -> 
        (x d.endDate) - (x d.startDate)
    rect.exit!.remove!

    rect.on 'mouseenter' (e) -> 
      tooltipEventGroup = (eventGroup.selectAll '.tooltip-event').data [e], keyFunction
      tooltipEventGroup.enter!.append 'g'
        ..attr 'class' 'tooltip-event'
          ..append 'rect'
            ..attr 'rx' 5 
            ..attr 'ry' 5 
            ..attr 'class' 'tooltip'
            ..attr 'transform' rectTransform
            ..attr 'height' (d) ->
              y.rangeBand!
            ..attr 'width' (d) ->
              (x d.endDate) - (x d.startDate)
        ..on 'mouseover' (e) ->
          overlayGroup = svg.select '.overlay'
          tooltip = (overlayGroup.selectAll '.tooltip').data [e], keyFunction
          tooltip.enter!.insert 'rect' ':first-child'
            ..attr 'rx' 5 
            ..attr 'ry' 5 
            ..attr 'class' 'tooltip'
          tooltip.transition!.attr 'y' 0
            ..attr 'transform' rectTransform
            ..attr 'height' (d) ->
              y.rangeBand!
            ..attr 'width' (d) ->
              (x d.endDate) - (x d.startDate)
          tooltip.exit!.remove!
        ..on 'mouseout' (e) ->
          overlayGroup = svg.select '.overlay'
          tooltip = (overlayGroup.selectAll '.tooltip').data [], keyFunction
          tooltip.exit!.remove!
      tooltipEventGroup.exit!.remove! 

    gantt
  
  gantt.margin = (value) ->
    return margin if not arguments.length
    margin := value
    gantt
  
  gantt.timeDomain = (value) ->
    return [timeDomainStart, timeDomainEnd] if not arguments.length
    timeDomainStart := +value.0
    timeDomainEnd := +value.1
    gantt
  
  gantt.timeDomainMode = (value) ->
    return timeDomainMode if not arguments.length
    timeDomainMode := value
    gantt
  
  gantt.taskTypes = (value) ->
    return taskTypes if not arguments.length
    taskTypes := value
    gantt
  
  gantt.taskStatus = (value) ->
    return taskStatus if not arguments.length
    taskStatus := value
    gantt
  
  gantt.width = (value) ->
    return width if not arguments.length
    width := +value
    gantt
  
  gantt.height = (value) ->
    return height if not arguments.length
    height := +value
    gantt
  
  gantt.tickFormat = (value) ->
    return tickFormat if not arguments.length
    tickFormat := value
    gantt
  
  gantt