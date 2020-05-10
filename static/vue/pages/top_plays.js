Vue.use(window.VueTimeago);
new Vue({
    el: "#TopPlays",
    delimiters: ["<%", "%>"],
    data(){
        return{
            mode: 0,
            plays: [],
            load: true,
            period: "all",
            page: 1,
            relax: "0"
        }
    },
    watch:{
        mode(){
            this.getPlays();
        },
        period(){
            this.getPlays();
        },
        relax(){
            this.getPlays();
        }
    },
    created(){
        var vm = this;
        $(function() {
            $(window).scroll(function () { 
                if (($(window).scrollTop() + $(window).height() > $(document).height()-300) && vm.load == false && vm.plays.length >= vm.page * 33)  {
                    vm.getPlays(vm.page+1, true);
                }
            });
            vm.getPlays();
        });
    },
    methods:{
        getPlays: function(page=1){
            var vm = this;
            this.page = page;
            this.load = true;
            this.$axios.get(pythonAPI + "/plays", { params:{
                page: this.page,
                m: this.mode,
                period: this.period,
                rx: this.relax
            }}).then(function(response){
                vm.plays = response.data.result;
                vm.load = false;
            });
            
        },
        formatDate: function(unix){
            var date = new Date(unix * 1000);
            return date.toLocaleString();
        }
    }
});