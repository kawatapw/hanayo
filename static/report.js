Vue.use(window.VueTimeago);
new Vue({
    delimiters: ["<%", "%>"],
    el: "#user"+userID,
    name: 'profile',
    data() {
        return {
            userID: userID,
            reportHimself: (personalID ? userID == personalID : false),
            reportReason: "Other (type below)",
            reportComment: "",
            allowedToReport: allowed,
            mode: 0,
            reportStatus: 0,
            reportWindow: false
        }
    },
    created(){
        var vm = this;
        vm.getCharts(); 
        $('select#reasonpicker').change((e)=>{
            var target = e.target;
            vm.reportReason = target.value;
        });
    },
    methods: {
        submitReport(){
            var formData = new FormData();
            formData.append("userid", userID);
            formData.append("reasons", this.reportReason);
            formData.append("text", this.reportComment);
            var vm = this;
            if(!this.reportComment == "" && !this.reportHimself && this.allowedToReport) {
                this.$axios.post("/report", formData).then(function(response){
                    vm.reportStatus = 1;
                    setTimeout(()=> {vm.reportWindow = false}, 3000);
                });
            }
        },
        axiosGet(URL, params) {
            var request = this.$axios.get(URL, {
                params: params
            });
            return request;
        },  
        getCharts(){
            var vm = this;
            this.axiosGet(pythonApi+"/users/graph", {
                userid: this.userID,
                m: this.mode
            }).then(function(response){
                vm.initCharts(response.data);
                
            });
        
        },

        initCharts: function(charts){
            var vm = this;
            var chart;
            var highLimit = charts["high_limit"];
            var lowLimit = charts["low_limit"];
            var ValueTicks = charts["value_ticks"];
            nv.addGraph(function() {
                chart = nv.models.lineChart()
                .options({
                    margin: {left: 80, bottom: 45},
                    x: function(d) { return d[0] },
                    y: function(d) { return d[1] },
                    showXAxis: true,
                    showYAxis: true
                })
                ;
        
              chart.xAxis
              .axisLabel("Days")
              .tickFormat(function(d) {
                  if (d == 0) return "now";
                  return -d + " days ago";
              });
        
              chart.yAxis
              .axisLabel('Performance')
              .tickFormat(function(d) {
                  if (!d || d == 0) return "-";
                  return  d +"pp";
              });
        
        
              chart.yScale(d3.scale.log().clamp(true));
        
        
              chart.forceY([highLimit,lowLimit]);
              chart.yAxis.tickValues(ValueTicks);
        
        
              chart.xAxis.tickValues([-60, -45, -30, -15, 0]);
              chart.forceX([-31,0]);
        
              // No disabling / enabling elements allowed.
              chart.legend.updateState(false);
              chart.interpolate("basis");
              d3.selectAll("#chart1 svg>*").remove();
              var svg = d3.select('#chart1 svg');
        
              svg.datum([
                {
                    area: false,
                    values: charts["data"],
                    key: "Performance",
                    color: "#555",
                    size: 6
                },
            ])
              .call(chart);
        
        
              return chart;
            });
        }
    }
});