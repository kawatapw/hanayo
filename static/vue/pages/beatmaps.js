Vue.use(window.VueTimeago);
new Vue({
    el:"#beatmap"+beatmapID,
    delimiters: ["<%","%>"],
    data(){
        return{
            beatmapID: beatmapID,
            mode: "0",
            scores: [],
            playing: false,
            loading: true,
            relax: "0"
        }
    },
    watch:{
        relax(){
            this.getScores();
        },
        mode(){
            this.getScores();
        },
        beatmapID(){
            this.getScores();
        }
    },
    created(){
        this.getScores();
    },
    methods:{
        getScores: function(){
            var vm = this;
            vm.loading = true
            this.$axios.get(pythonAPI + "/beatmaps/scores?b="+this.beatmapID, 
            { params: {
                    mode: this.mode,
                    rx: this.relax
                }
            }).then(function(response){
                vm.scores = response.data.data;
                vm.loading = false;
            });
            
        },
        play(){
            var audioElement = document.getElementsByTagName("audio")[0];
            var vm = this;
            if (audioElement && audioElement.currentTime > 0){
                audioElement.pause();
                audioElement.currentTime = 0;
                audioElement = null;
                if(vm.playing) return;
            }
            if(!audioElement){
                audioElement =  document.createElement('audio');
                window.audioElement = audioElement;
            }
            this.playing = true;
            audioElement.volume=0.4;
            audioElement.play();
            audioElement.addEventListener('ended', function() {
                vm.playing = false;
                audioElement.currentTime = 0;
            }, false);
            audioElement.addEventListener('pause', function() {
                vm.playing = false;
                return;
            }, false);
        },
        urldecode (str) {
            return decodeURIComponent(unescape(str));
        }
    }
});