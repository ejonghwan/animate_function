/*
    모니터 화면 주사율 : FPS (Frame Per Second)
    모니터 화면에 일초에 몇번의 프레임을 쏘는 지에 대한 단위기준
    일반적인 모니터의 화면 주사율 60hrz (1초에 60프레임)
    - 이론적으로는 1초에 여러번의 프레임을 보여줄수록 모션이 풍부해지겠지만
    - 실제적으로는 사람의 눈으로 인지할 수 있는 화면 주사율은 보통 60fps
    - 결국 1초에 천개의 화면을 연속적으로 보여주나 1초에 50번의 화면의 연속적으로 보여주나 크게 체감차이 없음
    - 대부분의 에니매이션, 영화등은 최대 60fps로 화면을 출력
   

    setInterval vs requestAnimationFrame
    setInterval
    - 화면의 주사율과는 상관없이 무조건 지정한 반복횟수와 인터벌에 따라 동작
    - 기본적으로 자바스크립트에서 하나의 싸이클(반복)을 도는데 걸리는 최소 시간은 1ms
    - 결국 특정 구문을 0.0001초의 시간만큼 반복을 돌리면 1초에 1000번의 함수가 실행됨
    - 싱글쓰레드인 자바스크립트 엔진의 특성상 callstack에 쌓여있는 모션 작업이 끝날때까지 대기상태
    - 결국 setInterval로 animation작업시 사람이 인지할 수도 없는 수준의 많은 반복처리를 브라우저가 해 부하를 검

    requestAnimationFrame
    - 기본적으로 해당메서드 자체적으로 반복기능이 없으므로 재귀적으로 반복처리를 해야됨
    - 해당메서드는 콜백함수르를 넣어서 반복동작을 지정
    - 해당메서드는 자동으로 현재 출력되고 있는 모니터의 주사율에 맞춰서 자동으로 프레임 동작
    - 60fps의 주사율 모니터에서는 반복을 딱 해당 주사율에 맞춰서 60번만 동작하여  불필요한 프레임 드랍 방지
    - 딱 브라우저의 성능에 맞춰서 최적화된 모션을 실행


    performance.now();
    -특정구문의 정밀한 시간계산이 필요할때 쓰이는 시간측정 함수
    -기존 Date().getTime()의 차이점은 현재 컴퓨터상의 시간 기반이 아닌 
    -브라우저가 로딩된 시점부터 시간을 카운트시작

*/
const btn = document.querySelector("button");
const box = document.querySelector(".box");

btn.onclick = function(){
    animate(box,{
        prop : "opacity",
        value : 0,
        duration : 1000,
        callback : function(){
            alert("test");
        }
    });    
}

function animate(selector, option){
    const startTime = performance.now();
    let current_value;

    if(option.prop === "opacity"){
        current_value = parseFloat( getComputedStyle(selector)[option.prop]);
    }else{
        current_value = parseInt( getComputedStyle(selector)[option.prop]);
    }
    

    if(current_value == option.value) return;
    if(current_value < option.value ) {
        requestAnimationFrame(run_plus);
    }else{
        requestAnimationFrame(run_minus);
    } 

    function  run_plus(time){           
        let timeLast = time - startTime; 
        let progress = timeLast / option.duration; 
    
        if(progress < 0) progres = 0; 
        if(progress > 1 ) progress = 1; 
        if(progress < 1 ){
            timer = requestAnimationFrame(run_plus); 
        }else{
            cancelAnimationFrame(timer);
            if(option.callback) option.callback();
        }     
      
        let result = current_value + ( (option.value - current_value)*progress  );

        if(option.prop === "opacity"){
            selector.style[option.prop] = result; 
        }else{
            selector.style[option.prop] = result+"px"; 
        }             
    }

    function  run_minus(time){           
        let timeLast = time - startTime; 
        let progress = timeLast / option.duration; 
    
        if(progress < 0) progres = 0; 
        if(progress > 1 ) progress = 1; 
        if(progress < 1 ){
            timer = requestAnimationFrame(run_minus); 
        }else{
            cancelAnimationFrame(timer);
            if(option.callback) option.callback();
        }       
      
        let result = current_value - ( (current_value - option.value)*progress  );

        if(option.prop === "opacity"){
            selector.style[option.prop] = result; 
        }else{
            selector.style[option.prop] = result+"px"; 
        }       
    }
}


