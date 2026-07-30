$(function () {

    /*
        날씨 코드(weather code) → 아이콘, 날씨, 테마 정보 반환 
         - Open-Meteo API 의 날씨 코드를 7개의 카테고리로 단순화
         - theme 는 body[data-weather="..."] 에 사용
         - 자세한 매칭 자료는 weather_code_매핑표.md 파일 참고
    */
    function getWeatherInfo(code) {
        if (code === 0) return { icon: 'icons/clear-day.svg', label: '맑음', theme: 'sunny' };
        if (code === 1) return { icon: 'icons/partly-cloudy-day.svg', label: '대체로 맑음', theme: 'sunny' };
        if (code === 2) return { icon: 'icons/cloudy.svg', label: '구름 조금', theme: 'cloudy' };
        if (code === 3) return { icon: 'icons/overcast.svg', label: '흐림', theme: 'cloudy' };
        if (code === 45 || code === 48) return { icon: 'icons/fog.svg', label: '안개', theme: 'foggy' };
        if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
            return { icon: 'icons/rain.svg', label: '비', theme: 'rainy' };
        }
        if ([71, 73, 75, 77, 85, 86].includes(code)) {
            return { icon: 'icons/snow.svg', label: '눈', theme: 'snowy' };
        }
        if ([95, 96, 99].includes(code)) {
            return { icon: 'icons/thunderstorms.svg', label: '뇌우', theme: 'thunder' };
        }
        return { icon: 'icons/thermometer.svg', label: '알 수 없음', theme: 'sunny' };
    }

    // API 에서 전달된 값 중 일부가 null 로 전달되기 대문에
    // null 이거나 값이 없으면 '-' 으로 표시
    function safeRound(value, suffix) {
        if(value === null || value === undefined) return '-';
        return Math.round(value) + (suffix || "");
    }

    // 2026-07-30T15:05 → "15:05"
    function formatClock(isoTime) {
        return isoTime.split("T")[1];
    }

    // ----------------------------------------
    // 상태 표시
    //  - 로딩/에러 메세지 표시
    //  - 탭바, 패널 숨기기
    // ----------------------------------------
    function showStatus(msg) {
        $("#statusMsg").text(msg).prop("hidden", false);

        $("#tabBar").prop("hidden", true);
        $("#panel-summary").prop("hidden", true);
        $("#panel-hourly").prop("hidden", true);
    }
    function showError(msg) {
        showStatus("⚠️ " + msg);
    }

    // ----------------------------------------
    // Open-Meteo Forecast API 호출
    // ----------------------------------------
    function loadWeather(lat, lon, displayName) {
        showStatus("날씨 정보를 불러오는 중입니다...");

        $.getJSON("https://api.open-meteo.com/v1/forecast", {
            latitude: lat,
            longitude: lon,
            current: "temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m",
            daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset",
            forecast_days: 5,
            timezone:"auto"
        })
        .done(function(data) { 
            showStatus("정상적으로 불러왔습니다!");
        })
        .fail(function() { 
            showError("날씨 정보를 가져오지 못했습니다. 잠시후 다시 시도해주세요.");
        })
    }
    
    //| 서울 | 37.5665 | 126.9780 |
    loadWeather(37.5665, 126.9780, "서울");

    // ----------------------------------------
    // 이벤트 연결
    // ----------------------------------------
    // 검색 기능
    $("#searchForm").on("submit", function(e) {
        e.preventDefault();
    });

    // 탭 전환(주간 날씨(summary) ↔ 시간별 날씨(hourly))
    $("#tabBar").on("click", ".tab-btn", function() {
        
        $(".tab-btn").removeClass("active").attr("aria-selected", "false");
        $(this).addClass("active").attr("aria-selected", "true");
        
        // summary 또는 hourly 를 반환
        const tab = $(this).data("tab");
        $("#panel-summary").prop("hidden", tab !== "summary");
        $("#panel-hourly").prop("hidden", tab !== "hourly");
    });
    
    

});