/**
 * jQuery.accordionSlide.js
 * @authors wxm (you@example.org)
 * @date    2017-02-08 16:42:15
 * @version $Id$
 */
(function(){

	// 默认参数
	var defaults = {
		speed : 500, //切换动画时间
		starPage : 5, //开始页码
		autoPlay : false, //是否自动播放
		autoTime : 1000, //多长时间自动播放一次
        slideAfter : function() {}, //滑动结束时
        slideBefore : function() {} //滑动开始时
	};

    // 构造函数
    function AccordionSlide($this,option){
    	this.$this = $this;
        this.opt = $.extend({}, defaults, option);
        this.curIndex = this.opt.starPage-1;
        this.timer = null;
        this.$slide = this.$this.find('.slide');
        this.slideLen = this.$slide.length;

        this.init();
    }

    //添加私有方法
    AccordionSlide.prototype = {
    	//修正构造函数指向
    	constructor : AccordionSlide,

    	init: function() {
    		if(this.opt.starPage>this.slideLen +1||this.opt.starPage<=0){
    			alert('您的参数设置有误，请检查哦');
    			return ;
    		}

    		this.move(this.opt.starPage-1);
	        this.mouseEvent();
	        if(this.opt.autoPlay){
	        	this.autoPlay();
	        }     
    	},

    	mouseEvent : function() {
    		var self= this;

            self.$slide.mouseenter(function() {
            	var curSlide = $(this).index();
            	self.move(curSlide);	
            });
            
            if(self.opt.autoPlay){
            	self.$this.mouseenter(function(){
            		clearInterval(self.timer);
            	}).mouseleave(function() {
            		self.autoPlay();
            	});
            }   
    	},

    	move : function(num) {
            var self= this;
	  		var wrapWidth =  self.$this.width();  //容器的宽
	        var everyWidth = self.$slide.width(); //每一个轮播的宽
	        var keyWidth = Math.ceil((wrapWidth-everyWidth)/(self.slideLen-1));  //手风琴琴键的宽度
            
            if(self.$this.is(':animated')){ return;}

            self.$slide.eq(num).addClass('active-slide').siblings().removeClass('active-slide');

            self.opt.slideBefore();
            
            for(var i=0; i<num; i++){
              	self.$slide.eq(i).stop(true).animate({'left':i*keyWidth+'px'}, self.opt.speed, "easeOutSine");
            }

            self.$slide.eq(num).stop(true).animate({'left':num*keyWidth+'px'}, self.opt.speed, "easeOutSine",function() {
                self.opt.slideAfter();
            });

            for(var i=num+1; i<self.slideLen; i++){
                self.$slide.eq(i).stop(true).animate({'left':(i-1)*keyWidth+everyWidth+'px'},self.opt.speed, "easeOutSine");
            }
            self.curIndex = num;
    	},

    	autoPlay : function() {
    		var self = this;

            self.timer = setInterval(function() {
            	if(self.curIndex > self.slideLen-2) {
            		self.curIndex = -1;
            	}
            	self.curIndex ++;
            	self.move(self.curIndex);
            },self.opt.autoTime);
    	}
    };

    $.fn.accordionSlide = function(option) {
        new AccordionSlide($(this),option);
        return this;
    };


})(jQuery);
