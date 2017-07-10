/**
 * Author zhouzy
 * Date   2014/9/23
 *
 * 青牛软件成都研发中心
 * 前端框架 cri 基础类
 *
 * 版本 v 2.0
 *
 */

!function(window){
    window.cri = {};

    function Class(){}

    Class.extend = function(subType){
        var prototype = (function(prototype){
            function Prototype(){}
            Prototype.prototype = prototype;
            return new Prototype();
        }(this.prototype));

        prototype.constructor = subType;

        subType.prototype = prototype;

        subType.extend = this.extend;

        return subType;
    };

    cri.Class = Class;

    /**
     * 获取表单值
     * @param $form
     * @returns {{}}
     */
    cri.getFormValue = function($form){
        var o = {},
            inputQuery = ":input:not(:button,[type=submit],[type=reset],[disabled])",
            selectQuery = "select";
        $(inputQuery,$form).each(function(){
            this.name && (o[this.name] = $(this).val());
        });
        $(selectQuery,$form).each(function(){
            var role = $(this).attr('data-role');
            if(role && role=='selectBox'){
                this.name && (o[this.name] = $(this).data("selectBox").value());
            }
            else{
                this.name && (o[this.name] = $(this).val());
            }
        });
        return o;
    };

    /**
     * 设置表单值
     * @param $form
     * @param o
     */
    cri.setFormValue = function($form,o){
        for(var name in o){
            var $i = $("[name=" + name + "]",$form);
            if($i.length){
                switch($i.attr('data-role')){
                    case 'input':{
                        $i.data('input').value(o[name]);
                    }break;
                    case 'timeInput':{
                        $i.data('timeInput').value(o[name]);
                    }break;
                    case 'selectBox':{
                        $i.data('selectBox').value(o[name]);
                    }break;
                    default:{
                        $i.val(o[name]);
                    }
                }
            }
        }
    };

    /**
     * 判断是否为闰年
     * @param year
     * @returns {boolean}
     */
    cri.isLeapYear = function(year){
        return (0==year%4&&((year%100!=0)||(year%400==0)));
    };

    /**
     * 日期格式化
     * 格式 YYYY/yyyy/YY/yy 表示年份
     * MM/M 月份
     * W/w 星期
     * dd/DD/d/D 日期
     * hh/HH/h/H 时间
     * mm/m 分钟
     * ss/SS/s/S 秒
     */
    cri.formatDate = function(date,formatStr){
        var str    = formatStr || 'yyyy-MM-dd',
            year   = date.getFullYear(),
            month  = date.getMonth()+1,
            day    = date.getDate(),
            hour   = date.getHours(),
            minute = date.getMinutes(),
            second = date.getSeconds();

        str=str.replace(/yyyy|YYYY/,year);
        str=str.replace(/yy|YY/,(year % 100)>9?(year % 100).toString():'0' + (year % 100));

        str=str.replace(/MM/,month>9?month.toString():'0' + month);
        str=str.replace(/M/g,month);

        str=str.replace(/dd|DD/,day>9?day.toString():'0' + day);
        str=str.replace(/d|D/g,day);

        str=str.replace(/hh|HH/,hour>9?hour.toString():'0' + hour);
        str=str.replace(/h|H/g,hour);

        str=str.replace(/mm/,minute>9?minute.toString():'0' + minute);
        str=str.replace(/m/g,minute);

        str=str.replace(/ss|SS/,second>9?second.toString():'0' + second);
        str=str.replace(/s|S/g,second);
        return str;
    };

    /**
     *把日期分割成数组
     */
    cri.date2Array = function(myDate){
        return [
            myDate.getFullYear(),
            myDate.getMonth(),
            myDate.getDate(),
            myDate.getHours(),
            myDate.getMinutes(),
            myDate.getSeconds()
        ];
    };

    /**
     * 日期保存为JSON
     * @param myDate
     * @returns {{yyyy: number, MM: number, dd: (*|number), HH: number, mm: number, ss: number, ww: number}}
     */
    cri.date2Json = function(myDate){
        return {
            yyyy:myDate.getFullYear(),
            MM:myDate.getMonth(),
            dd:myDate.getDate(),
            HH:myDate.getHours(),
            mm:myDate.getMinutes(),
            ss:myDate.getSeconds(),
            ww:myDate.getDay()
        };
    };

    /**
     * 字符串转成日期类型
     * 日期时间格式 YYYY/MM/dd HH:mm:ss  YYYY-MM-dd HH:mm:ss
     * 日期格式 YYYY/MM/dd YYYY-MM-dd
     */
    cri.string2Date = function(d){
        return new Date(Date.parse(d.replace(/-/g,"/")));
    };

    /**
     * 将json格式字符串转换成对象
     * @param json
     * @returns {*}
     *
     * {{deprecated}}
     */
    cri.parseJSON = function(json){
        return json ? (new Function("return " + json))(): {};
    };

    /**
     * 判断是否为数组
     * @param o
     * @returns {boolean}
     */
    cri.isArray = function(o){
        return Object.prototype.toString.call(o) === '[object Array]';
    };

    /**
     * 判断是否为数字
     * @param s
     * @returns {boolean}
     */
    cri.isNum = function(s){
        if (s!=null && s!=""){
            return !isNaN(s);
        }
        return false;
    };

    /**
     * 判断是否为电话号码
     * @param s
     * @returns {boolean}
     */
    cri.isPhoneNo = function(s){
        return /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/.test(s);
    };

    /**
     * 向前兼容HTML5特性，方法
     */
    !function forwardCompatibleHtml5(){
        if (!Array.prototype.indexOf) {
            Array.prototype.indexOf = function (searchElement, fromIndex) {
                if( this === undefined || this === null ) {
                    throw new TypeError( '"this" is null or not defined' );
                }
                var length = this.length >>> 0; // Hack to convert object.length to a UInt32
                fromIndex = +fromIndex || 0;
                if (Math.abs(fromIndex) === Infinity) {
                    fromIndex = 0;
                }
                if (fromIndex < 0) {
                    fromIndex += length;
                    if (fromIndex < 0) {
                        fromIndex = 0;
                    }
                }
                for (;fromIndex < length; fromIndex++) {
                    if (this[fromIndex] === searchElement) {
                        return fromIndex;
                    }
                }
                return -1;
            };
        }
        JSON || (window['JSON'] = {
            parse:function(jsonStr){
                return cri.parseJSON(jsonStr);
            },
            stringify:function(obj){
                return obj.toSource();
            }
        });
    }();


    /**
     * 拓展jQuery对象方法
     */
    !function(jQuery){
        /**
         * 获取元素的绝对高度像素值
         * 当元素隐藏，或者父元素高度未设置时，返回null
         * 如果调用方法时，传入了value，则使用该value，不再去获取元素CSS高度及height属性
         * @param value 设定高度(String,Number,百分比)
         * @returns {*} 绝对高度值，类型为Number或者为Null
         * @private
         */
        $.fn._getHeightPixelValue = function(value){
            var $this       = $(this),
                styleHeight = $this[0].style.height,
                propHeight  = $this[0].height,
                calHeight   = value || styleHeight || propHeight;
            if(calHeight){
                //百分比
                if(/\d*%/.test(calHeight)){
                    var $parent = $this.parent();
                    if($parent.is(":visible") && $parent.css('height')!='0px'){
                        return Math.floor($this.parent().height() * parseInt(calHeight) / 100);
                    }
                    else{
                        return null;
                    }
                }
                else{
                    return parseInt(calHeight);
                }
            }
            else{
                return null;
            }
        };

        /**
         * 获取元素的绝对宽度像素值
         * 当父元素隐藏，或者父元素宽度未设置时，返回null
         * 如果调用方法时，传入了value，则使用该value，不再去获取元素CSS宽度及width属性
         * @param value 设定宽度(String,Number,百分比)
         * @returns {*} 绝对宽度值，类型为Number或者为Null
         * @private
         */
        $.fn._getWidthPixelValue = function(value){
            var $this       = $(this),
                styleWidth = $this[0].style.width,
                propWidth  = $this[0].width,
                calWidth   = value || styleWidth || propWidth;
            if(calWidth){
                //百分比
                if(/\d*%/.test(calWidth)){
                    var $parent = $this.parent();
                    if($parent.is(":visible") && $parent.css('width')!='0px'){
                        return Math.floor($this.parent().width() * parseInt(calWidth) / 100);
                    }
                    else{
                        return null;
                    }
                }
                else{
                    return parseInt(calWidth);
                }
            }
            else{
                return null;
            }
        };

        /**
         * 拓展 jquery formValue 方法
         *
         * @param o
         * @returns {{}}
         */
        $.fn.formValue = function(o){
            if(arguments.length>0){
                cri.setFormValue($(this),o);
            }
            else{
                return cri.getFormValue($(this));
            }
        };

        /**
         * 重置form
         */
        $.fn.formReset = function(param){
            var $this = $(this),
                inputQuery = ":input:not(:button,[type=submit],[type=reset],[disabled])",
                selectQuery = "select";
            param = param || {};
            $(inputQuery,$this).each(function(){
                var role = $(this).attr('data-role');
                var value = this.name ? param[this.name] : '';
                value = value || '';
                if(role){
                    if(role=='input'){
                        $(this).data("input").value(value);
                    }
                    else if(role == 'timeInput'){
                        value = value || new Date();
                        $(this).data("timeInput").value(value);
                    }
                }
                else{
                    $(this).val(value);
                }
            });
            $(selectQuery,$this).each(function(){
                var role = $(this).attr('data-role');
                var value = this.name ? param[this.name] : '';
                value = value || '';
                if(role && role=='selectBox'){
                    if(value != ''){
                        $(this).data("selectBox").value(value);
                    }
                    else{
                        $(this).data("selectBox").select(0);
                    }
                }
                else{
                    if(value != ''){
                        $(this).val(value);
                    }else{
                        this.selectedIndex = 0;
                    }
                }
            });
        };
    }(jQuery);
}(window);


/**
 * Author zhouzy
 * Date   2014/10/14
 *
 * jQuery 插件基类
 * 继承自Class
 *
 */
!function(window){

    "use strict";

    var cri = window.cri,
        $   = window.jQuery;

    var Widgets = cri.Class.extend(function(element,options){
        this.$element = $(element);
        this._initOptions(options);
        this._init();
        this._eventListen();
    });

    /**
     * 初始化组件配置参数
     * @param options
     * @private
     */
    Widgets.prototype._initOptions = function(options) {
        this.options = $.extend(true,{}, this.options, options);
    };

    /**
     * 初始化组件DOM结构
     * @private
     */
    Widgets.prototype._init = function(){};

    /**
     * 初始化组件监听事件
     * @private
     */
    Widgets.prototype._eventListen = function(){};

    /**
     * 销毁组件
     * @private
     */
    Widgets.prototype._destroy = function(){
        var $element = this.$element;
        var $warpper = $element.parent();
        $warpper.after($element).remove();
    };

    /**
     *
     * @private
     */
    Widgets.prototype._getHeightPixelValue = function($d,value){
        var styleHeight = $d[0].style.height,
            propHeight  = $d[0].height,
            calHeight   = value || styleHeight || propHeight;

        if(calHeight){
            var arr = ("" + calHeight).split("%");
            if(arr.length>1){
                /**
                 * 当 parent 为隐藏元素，则不能获取到parent高度,或者 parent 未设置高度,此时返回 null
                 */
                var $parent = $d.parent();
                if($parent.is(":visible") && $parent.style.height){
                    calHeight = Math.floor($d.parent().height() * arr[0] / 100);
                }
                else{
                    return null;
                }
                calHeight = (""+calHeight).split("px")[0];
            }
            if(calHeight){
                return parseInt(calHeight);
            }
        }
        else{
            return null;
        }
    };

    cri.Widgets = Widgets;
}(window);
/**
 * Author zhouzy
 * Date   2014/9/18
 * grid 组件
 * include Pager
 */
!function(){

    "use strict";

    var cri = window.cri,
        $   = window.jQuery;

    /**
     * 定义表格标题，工具栏，分页高度
     */
    var _titleH       = 41, //标题高度
        _toolbarH     = 40, //工具栏高度
        _pagerH       = 50, //分页高度
        _gridHeadH    = 41, //表格头高度
        _cellMinW     = 5;  //单元格最小宽度

    function _getPlainText(text){
        text = ("" + text).replace(/(<.*?>)|(<\/.*?>)/g,"");
        return text;
    }

    /**
     * 获取Grid每列信息
     * @param $table        原始 table jquery对象
     * @param optionColumns 使用 options.columns 初始化列属性
     * @returns {*}         处理后的列属性
     * @private
     */
    function _getColumnsDef($table,optionColumns){
        var columns = optionColumns || (function(){
            var columns = [];
            $("tr th,td", $table).each(function(){
                var options = '{' + $(this).data("options") + '}';
                columns.push($.extend({title:$(this).html()},cri.parseJSON(options)));
            });
            return columns;
        }());
        $.map(columns,function(column){
            if(column.title && column.width){
                column._width = column.width;
            }
            return column;
        });
        return columns;
    }

    /**
     * 表格默认属性
     * @private
     */
    var _defaultOptions = {
        title:null,
        height:null,
        width:null,
        toolbar:null,
        url:null,
        param:{},
        checkBox:false,
        rowNum:true,
        columns:null,
        pagination:true,
        page:1,
        pageSize:10,
        filter:false,

        onChange:null,   //行点击时触发
        onSelected:null, //当选择一行或者多行时触发
        onDblClick:null, //双击行时触发
        onLoad:null,     //构造表格结束时触发
        ajaxDone:null    //当AJAX请求成功后触发
    };

    var Grid = cri.Widgets.extend(function(element,options){
        this.options        = _defaultOptions;
        this.$element       = $(element);
        this.$grid          = null;
        this.$gridhead      = null;
        this.$gridbody      = null;
        this.toolbar        = null;
        this.pager          = null;
        this.$title         = null;
        this._rows          = null;
        this._columns       = [];
        this._selectedId    = [];
        this._gridClassName = this._gridClassName || "datagrid";
        cri.Widgets.apply(this,arguments);
    });

    $.extend(Grid.prototype,{
        /**
         * 监听用户事件
         * @private
         */
        _eventListen:function(){
            var that       = this,
                op         = this.options,
                dragStartX = 0,
                clickTimer = null;

            this.$gridbody
                .on("scroll",function(){
                    $(".grid-head-wrap",that.$gridhead).scrollLeft($(this).scrollLeft());
                })
                .on('click', "tr", function(e){
                    if(clickTimer != null){
                        clearTimeout(clickTimer);
                    }
                    clickTimer = window.setTimeout(function(){
                        $("input[type=checkbox]",that.$gridhead).prop("checked",false);
                        that._setSelected(e);
                        var item  = $(e.target).closest("tr"),
                            rowId = item.data('rowid'),
                            row = that._getRowDataById(rowId);
                        that.options.onChange && that.options.onChange.call(that,row);
                    },300);
                })
                .on('dblclick', "tr", function(e){
                    clearTimeout(clickTimer);
                });
            $(document).on("mouseup",function(e){
                that.$gridhead.css("cursor","");
                $(document).off("mousemove");
            });

            this.$gridhead
                .on('mousedown',".drag-line",function(e){
                    that.$gridhead.css("cursor","e-resize");
                    var dragLineIndex = 0;
                    op.rowNum && dragLineIndex++;
                    op.checkBox && dragLineIndex++;
                    dragLineIndex += $(this).data("drag");
                    var $col = $("col:eq("+ dragLineIndex +")",that.$gridhead);
                    dragStartX = e.pageX;
                    $(document).on("mousemove",function(e){
                        var px = e.pageX - dragStartX;
                        var width = +$col.width() + px;
                        var tableWidth = $("table",that.$gridhead).width();
                        dragStartX = e.pageX;
                        if(width >= _cellMinW){
                            $("table",that.$gridbody).width(tableWidth + px);
                            $("table",that.$gridhead).width(tableWidth + px);
                            $("col:eq("+ dragLineIndex +")",that.$gridhead).width(width);
                            $("col:eq("+ dragLineIndex +")",that.$gridbody).width(width);
                        }
                    });
                })
                .on('click',"input[type=checkbox]",function(e){
                    var isChecked = $(e.target).prop("checked");
                    if(isChecked){
                        that._selectedId = [];
                        $("tr",that.$gridbody).each(function(){
                            var $tr = $(this);
                            that._selectedId.push($tr.data("rowid"));
                            $tr.addClass("selected");
                            $('input[type=checkbox]',$tr).prop("checked",isChecked);
                        });
                    }else{
                        that._selectedId = [];
                        $("tr",that.$gridbody).removeClass("selected");
                    }
                    $("input[type=checkbox]",that.$gridbody).each(function(){
                        $(this).prop("checked",isChecked);
                    });
                    op.onChange && op.onChange.call(that);
                });
        },

        /**
         * 初始化组件HTML结构
         * @private
         */
        _init:function() {
            this._columns = _getColumnsDef(this.$element,this.options.columns);
            this._createGrid();
            this._createPage();
            this._getData();
            if(this.options.onLoad && typeof(this.options.onLoad) === 'function'){
                this.options.onLoad.call(this);
            }
        },

        /**
         * 初始化表格HTML结构
         * @private
         */
        _createGrid:function(){
            var height = this.$element._getHeightPixelValue(this.options.height);
            var width  = this.$element._getWidthPixelValue(this.options.width);
            //var $grid  = $("<div></div>").addClass("grid").addClass(this._gridClassName).addClass('panel panel-default');
            var $grid  = $("<div></div>").addClass("grid").addClass(this._gridClassName);

            $grid.attr("style",this.$element.attr("style")).css({width:width,height:height,display:'block'});

            this.$element.wrap($grid);
            this.$element.hide();
            this.$grid = this.$element.parent();
            this._createTitle(this.$grid);
            this._createToolbar(this.$grid);
            this._createGridView(this.$grid,height);
        },

        /**
         * 初始化表格 View HTML 结构
         * @param $parent
         * @param height
         * @private
         */
        _createGridView:function($parent,height){
            this.$gridview = $("<div></div>").addClass("grid-view");
            this.$gridhead = $("<div></div>").addClass("grid-head");
            $parent.append(this.$gridview.append(this.$gridhead).append(this.$gridbody));
            if(height){
                height -= _gridHeadH;
                this.options.title      && (height -= _titleH);
                this.options.toolbar    && (height -= _toolbarH);
                this.options.pagination && (height -= _pagerH);
            }
            this._createHead(this.$gridhead);
            this.$gridbody = this._createBody(height);
            this.$grid.append(this.$gridbody);
        },

        /**
         * 初始化表格标题 HTML 结构
         * @param $grid
         * @private
         */
        _createTitle:function($grid){
            if(this.options.title){
                this.$title = $('<div class="panel-heading"><span>' + this.options.title + '</span></div>');
                $grid.append(this.$title);
            }
        },

        /**
         * 初始化表格头 HTML 结构
         * @param $parent
         * @private
         */
        _createHead:function($parent){
            var $headWrap = $("<div></div>").addClass("grid-head-wrap"),
                //tableStyle = 'table table-bordered',
                tableStyle = 'table',
                $table    = $('<table class="'+tableStyle+'"></table>'),
                $tr       = $("<tr></tr>"),
                op        = this.options,
                columns   = this._columns;

            $table.append(this._createColGroup($parent.width()));

            if(op.checkBox){
                var $lineCheckbox = $("<td></td>").addClass("line-checkbox").append('<span class="td-content"><input type="checkbox"/></span>');
                $tr.append($lineCheckbox);
            }
            if(op.rowNum){
                var $lineNumber = $("<td></td>").addClass("line-number").append('<div class="td-content"></div>');
                $tr.append($lineNumber);
            }

            for(var i = 0,len = columns.length; i<len; i++){
                var that = this,
                    $td        = $('<td></td>'),
                    $dragLine  = $('<div></div>').addClass('drag-line').data('drag',i),
                    $tdContent = $('<div></div>').addClass('td-content grid-header-text'),
                    column     = columns[i];
                for(var key in column){
                    var value = column[key];
                    if(key == 'title'){
                        $tdContent.prop('title',value).append(value);
                        if(op.filter){
                            var $filterIcon = $('<span data-for="'+column.field+'" class="fa fa-filter filter-icon"></span>');
                            $filterIcon.click(function(e){
                                var gridHeadOffset = that.$grid.offset();
                                var iconOffset = $(this).offset();
                                var offset = {
                                    left:iconOffset.left-gridHeadOffset.left+10,
                                    top:iconOffset.top-gridHeadOffset.top
                                };
                                var key = $(e.target).data('for');
                                that._toggle(that.$grid.find('ul[data-for='+key+']'),offset);
                            });
                            $tdContent.append($filterIcon);
                        }
                    }
                    else if(key == 'style'){
                        $td.css(value);
                    }
                }

                $td.append($tdContent);
                i < (len - 1) && $td.append($dragLine);
                $tr.append($td);
            }
            $table.append($tr);
            $parent.html($headWrap.html($table));
        },

        /**
         * 初始化表格数据部分 HTML 结构
         * @param gridBodyHeight
         * @returns {*|HTMLElement}
         * @private
         */
        _createBody:function(gridBodyHeight){
            var $gridbody    = $('<div class="grid-body loading"></div>'),
                $loadingIcon = $('<i class="fa fa-spinner fa-pulse fa-spin"></i>').addClass("loadingIcon");
            if(gridBodyHeight){
                $gridbody.height(gridBodyHeight);
            }
            $gridbody.append($loadingIcon);
            return $gridbody;
        },

        /**
         * 刷新Grid Body数据行
         * @private
         */
        _refreshBody:function(rows){
            var self     = this,
                //tableStyle = 'table table-striped table-hover table-bordered',
                tableStyle = 'table table-striped table-hover',
                $table   = $('<table class="'+tableStyle+'"></table>'),
                op       = this.options,
                id       = 0,
                lineNum  = 1 + op.pageSize * (op.page - 1),
                columns  = this._columns;
            rows = rows || this._rows;
            this._selectedId = [];

            $table.append($("colgroup",this.$gridhead).clone());
            for(var i = 0,len = rows.length; i<len; i++){
                var row = rows[i],
                    $tr = $('<tr></tr>').data("rowid",id);
                if(op.checkBox){
                    var $checkBoxTd = $('<td class="line-checkbox"></td>');
                    if(row.check){
                        $tr.append($checkBoxTd.append('<input type="checkbox" checked/>'));
                        this._selectedId.push(id);
                    }
                    else{
                        $tr.append($checkBoxTd.append('<input type="checkbox"/>'));
                    }
                }
                if(op.rowNum){
                    $tr.append($("<td></td>").addClass("line-number").append(lineNum));
                }
                for(var j = 0,length = columns.length; j<length;j++){
                    var $td = $('<td></td>'),
                        $content = $('<div></div>').addClass('td-content'),
                        column = columns[j],
                        text   = row[column.field]==null ? "" : row[column.field],
                        _text  = ("" + text).replace(/(<([^a\/]).*?>)|(<\/[^a].*?>)/g,"");
                    var button = column['button'];
                    if(button){
                        if(!cri.isArray(button)){
                            button = [button];
                        }
                        var $button = button.map(function(button){
                            var $btn = $('<button class="btn btn-sm"></button>');
                            $btn.btn({
                                text:button.text, iconCls:button.iconCls,
                                handler:function(id){ return function(){ button.handler && button.handler(self._getRowDataById(id)); }; }(id)
                            });
                            return $btn;
                        });
                        $content.append($button);
                    }
                    else{
                        $content.prop("title",_text).append(_text);
                    }
                    $tr.append($td.append($content));
                }
                lineNum++;id++;
                $table.append($tr);
            }
            this.$gridbody.removeClass("loading").html($table);

            var $temp = this.$grid.clone();
            $temp.css({position:'fixed',left:'-10000px'});
            $('body').append($temp);
            var clientWidth = $temp.find('.grid-body').prop("clientWidth");
            if(clientWidth){
                var scrollBarW = $temp.find('.grid-body').width()-clientWidth;
                this.$gridhead.parent().css({"paddingRight":scrollBarW});
            }
            $temp.remove();
        },

        /**
         * 生成 cols HTML 结构
         * @param parentWidth
         * @returns {*|HTMLElement}
         * @private
         */
        _createColGroup:function(parentWidth){
            var $cols   = [],
                op      = this.options,
                columns = this._columns;
            op.checkBox && $cols.push($("<col/>").css('width',30));
            op.rowNum   && $cols.push($("<col/>").css('width',30));
            for(var i = 0,len = columns.length; i<len; i++){
                var $col = $("<col/>");
                columns[i]._width && $col.width(columns[i]._width);
                $cols.push($col);
            }
            return $("<colgroup></colgroup>").append($cols);
        },

        /**
         * 生成工具栏 HTML 结构
         * @param $parent
         * @private
         */
        _createToolbar:function($parent){
            if(this.options.toolbar) {
                this.toolbar = new cri.ToolBar($parent, {
                    buttons: this.options.toolbar
                });
            }
        },

        /**
         * 初始化表头过滤器
         * @returns {{}}
         * @private
         */
        _initFilter:function(){
            var rows = this._rows;
            var column = this._columns;
            var keysMap = {};
            this._filters = this._filters || {};

            for(var i in column){
                var field = column[i].field;
                var keys = {};
                for(var j=0,len=rows.length;j<len;j++){
                    var row = rows[j];
                    var value = row[field];
                    if(keys[value] == undefined){
                        keys[value] = true;
                    }
                }
                keysMap[field] = keys;
            }
            this._createFilterLists(keysMap);
        },

        _createFilterLists:function(keysMap){
            var that =this;
            for(var key in keysMap){
                var gridHeadOffset = this.$grid.offset();
                var filterIconOffset = this.$gridhead.find('span[data-for='+key+'].filter-icon').offset();
                var offset = {
                    left:filterIconOffset.left-gridHeadOffset.left+10,
                    top:filterIconOffset.top-gridHeadOffset.top
                };
                var $ul = that.$grid.find('ul[data-for='+key+']');
                $ul.length ? $ul.empty() : ($ul=$('<ul class="grid-filter" data-for="'+key+'"></ul>'));

                var $all = $('<input type="checkbox" name="all"/>').click(function(e){
                    var $ul = $(e.target).closest('ul');
                    if($(e.target).prop('checked')){
                        $ul.find('input[type=checkbox]').prop("checked",true);
                    }
                    else{
                        $ul.find('input[type=checkbox]').prop("checked",false);
                    }
                });
                $ul.append($('<li></li>').append($all,'全部'));

                var map = keysMap[key];
                for(var i in map){
                    var plainText = _getPlainText(i);
                    plainText=='null' && (plainText = '');
                    var $checkbox = $('<input type="checkbox" name="'+plainText+'"/>').data("value",i);
                    $ul.append($('<li class="filter-value"></li>').append($checkbox,plainText));
                }
                var $footer = $('<li class="footer"><button class="cancel">过滤</button></li>');
                $ul.append($footer);
                $ul.css(offset);
                $footer.find('button').button({
                    handler:(function($ul){
                        return function(){
                            var field = $ul.attr('data-for');
                            var values = [];
                            $ul.find('li.filter-value input[type=checkbox]').each(function(){
                                if($(this).prop('checked')){
                                    values.push($(this).data('value'));
                                }
                            });
                            that._filters[field] = values;
                            that._filter();
                            that._toggle($ul);
                        }
                    }($ul))
                });

                this.$grid.append($ul);

                $ul.find('li.filter-value input[type=checkbox]').click(function($all){
                    return function(){
                        $all.prop('checked',false)
                    };
                }($all));
            }
        },

        /**
         * 显示隐藏过滤器下拉选择框
         * @param $filterList
         * @private
         */
        _toggle:function($filterList,offset){
            var that = this;
            if($filterList.is(":hidden")){
                $filterList.css(offset).slideDown(200, function(){
                    $(document).mouseup(function(e) {
                        var _con = $filterList;
                        if (!_con.is(e.target) && _con.has(e.target).length === 0) {
                            $filterList.slideUp(200);
                        }
                    });
                });
            }
            else{
                $filterList.slideUp(200);
            }
        },

        /**
         * 执行过滤
         * @private
         */
        _filter:function(){
            var filters = this._filters;
            var rows = this._rows;

            for(var field in filters){
                var values = filters[field];
                var tempRows = [];
                for(var i= 0,len=values.length; i<len; i++){
                    var value = values[i];
                    for(var j=0,jLen = rows.length;j<jLen;j++){
                        if(("" + rows[j][field]) == value){
                            tempRows.push(rows[j]);
                        }
                    }
                }
                rows = tempRows;
            }
            this._refreshBody(rows);
        },

        /**
         * 生成翻页 HTML 结构
         * @private
         */
        _createPage:function(){
            var op = this.options;
            var grid = this;
            if(this.options.pagination){
                this.$pager = $('<div class="panel-footer"></div>');
                this.pager = new cri.Pager(this.$pager,{
                    page:op.page,
                    pageSize:op.pageSize,
                    total:0,
                    rowsLen:0,
                    onPage:function(page,pageSize){
                        op.page = page;
                        op.pageSize = pageSize;
                        grid._getData();
                    }
                });
                this.$grid.append(this.$pager);
            }
        },

        /**
         * 获取数据
         * @returns {boolean}
         * @private
         */
        _getData:function(){
            var result = true,
                op     = this.options,
                that   = this;
            if(op.pagination){
                op.param.page = op.page;
                op.param.rows = op.pageSize;
            }
            if(this.options.url){
                $.ajax({
                    type: "post",
                    url: this.options.url,
                    success: function(data){
                        if(op.ajaxDone){
                            var re = op.ajaxDone.call(that,data);
                            re && (data = re);
                        }
                        that._rows = data.rows || [];
                        op.total = data.total || 0;
                        that.pager && that.pager.update(op.page,op.pageSize,op.total,that._rows.length);
                        $('input[type=checkbox]',that.$gridhead).prop("checked",false);
                        that._refreshBody();
                        if(op.filter){
                            that._initFilter();
                        }
                    },
                    error: function(){
                        that._rows = [];
                        op.total = 0;
                        that.pager && that.pager.update(op.page,op.pageSize,op.total,that._rows.length);
                        that._refreshBody();
                    },
                    data:op.param,
                    dataType:"JSON",
                    async:false
                });
            }
            return result;
        },

        /**
         * 当用户点击选中行时触发onSelected事件
         * 当options.checkbox=true为多选,否则为单选
         * @param e
         * @private
         */
        _setSelected:function(e){
            var that  = this,
                item  = $(e.target).closest("tr"),
                rowId = item.data('rowid');

            if(this.options.checkBox){
                var $checkbox = item.find('input:checkbox');
                var isSelected = $checkbox.prop("checked");
                var selected = [];
                if(!$(e.target).is("input:checkbox")){
                    $checkbox.prop("checked",!isSelected);
                }
                this.$gridbody.find('tr').each(function(){
                    var $tr = $(this);
                    if($(this).find('input:checkbox').prop('checked')){
                        selected.push($tr.data('rowid'));
                    }
                    that._selectedId = selected;
                });
            }
            else{
                if(item.hasClass("selected")){
                    item.removeClass("selected");
                    this._selectedId = [];
                }
                else{
                    $("tr.selected",this.$gridbody).removeClass("selected");
                    item.addClass("selected");
                    this._selectedId = [rowId];
                }
            }
            if(this._selectedId && this._selectedId.length){
                this.options.onSelected && this.options.onSelected.call(this);
            }
        },

        /**
         * 根据td计算col的宽度
         * @private
         */
        _colsWidth:function(){
            var that = this;
            $("tr:eq(0) td",this.$gridhead).each(function(index){
                $('col:eq('+ index +')',that.$gridbody).width($(this).width() + 2*4);
                $('col:eq('+ index +')',that.$gridhead).width($(this).width() + 2*4);
            });
        },

        /**
         * 根据 id 获取某一行的数据
         * @param _uid
         * @returns {*}
         * @private
         */
        _getRowDataById:function(_uid){
            return this._rows[parseInt(_uid)];
        },

        /**
         * 当用户双击某一行触发
         * @param e
         * @private
         */
        _onDblClickRow:function(e){
            var that  = this,
                op    = this.options,
                item  = $(e.target).closest("tr"),
                rowid = item.data('rowid');
            this._selectedId = [rowid];
            $("tr.selected",this.$gridbody).removeClass("selected");
            item.addClass("selected");
            if(this.options.checkBox){
                $("input[type=checkbox]",this.$gridbody).prop("checked",false);
                $("input[type=checkbox]",item).prop("checked",true);
            }
            op.onDblClick && op.onDblClick.call(that,that._getRowDataById(rowid));
        },

        /**
         * 根据 param 重新加载表格
         * @param param
         */
        reload:function(param){
            param && (this.options.param = param);
            this.options.page = 1;
            this._selectedId = [];
            this._getData();
        },

        /**
         * 根据 param 指定的数据加载表格
         * @param param
         */
        loadData:function(param){
            if(cri.isArray(param)){
                this._rows = param;
                this._refreshBody();
                this.options.filter && this._initFilter();
            }
        },

        /**
         * 获取用户选择的数据
         * @returns {Array}
         */
        getSelected:function(){
            var selected = [],
                selectedId = this._selectedId;
            for(var i=0; i<selectedId.length;i++){
                selected.push(this._getRowDataById(selectedId[i]));
            }
            return selected;
        }

    });

    cri.Grid = Grid;
}();

/**
 * Author zhouzy
 * Date   2014/9/18
 * Button 组件
 *
 */
!function(window){

    "use strict";

    var cri = window.cri,
        $   = window.jQuery;

    var _defaultOptions = {
        text:"",
        iconCls:null,
        handler:null,
        enable:true
    };

    var BUTTON = "btn";

    var Button = cri.Widgets.extend(function(element,options){
        this.options     = _defaultOptions;
        this.$inputGroup = null;
        this.$button     = null;
        cri.Widgets.apply(this,arguments);
        this.$element.attr('data-role','button');
    });

    $.extend(Button.prototype,{
        _eventListen:function(){
            var that = this;
            this.$button.on("click",function(evt){
                that.options.enable && that.options.handler && that.options.handler.call();
				evt.preventDefault();
            });
        },

        _init:function(){
            this._create();
        },

        _reInit:function(options){
            this.options = $.extend(this.options,options);
            this.text(this.options.text);
            this.iconCls(this.options.iconCls);
            this.options.enable ? this.enable() : this.disable();
        },

        _create:function(){
            var op = this.options,
                iconCls = op.iconCls || '',
                $e = this.$element,
                $icon = '<span class="icon"><i class="' + iconCls + '"></i></span>';

            $e.addClass(BUTTON);
            $e.prepend($icon);
            op.text && $e.append(op.text);
            if(!op.enable){
                this.disable();
            }
            this.$button = $e;
        },

        /**
         * 设置按钮文本值
         * @param text
         */
        text:function(text){
            if(text.length){
                var $icon = this.$button.find('span.icon').clone();
                this.$button.empty();
                if($icon.length){
                    this.$button.append($icon);
                }
                this.$button.append(text);
            }
        },

        /**
         * 设置按钮图标
         * @param className
         */
        iconCls:function(className){
            this.$button.find('span.icon i').attr('class',className);
        },

        enable:function(){
            this.$button.removeClass("disabled");
            this.options.enable = true;
        },

        disable:function(){
            this.$button.addClass("disabled");
            this.options.enable = false;
        }
    });

    cri.Button = Button;

    $.fn.btn = function(option) {
        var o = null;
        this.each(function () {
            var $this   = $(this),
                button  = $this.data('widget'),
                options = typeof option == 'object' && option;
            if(button != null && button instanceof Button){
                button._reInit(option);
                o = button;
                return false;
            }
            $this.data('widget', (o = new Button(this, options)));

        });
        return o;
    };
}(window);

/**
 * Author zhouzy
 * Date   2015/4/8
 *
 * ContentLoader
 * ���ڼ���HTML
 */
!function(window){

    "use strict";

    var cri = window.cri,
        $   = window.jQuery;

    var CONTENT_LOADER = 'content-loader';
    var _defaultOptions = {
        content:null,
        isIframe:false,
        onReady:null
    };

    var ContentLoader = cri.Widgets.extend(function($element,options){
        this.options = _defaultOptions;
        cri.Widgets.apply(this,arguments);
        this.$content.attr('data-role','content-loader');
    });

    $.extend(ContentLoader.prototype,{

        _init:function(){
            this._createBody();
        },

        _createBody:function(){
            this.$content = $('<div class="' + CONTENT_LOADER + '"></div>');
            this.$element.append(this.$content);
            this._load();
        },

        _load:function(){
            var iframe = true,
                that = this;
            //jQuery
            if(this.options.content instanceof jQuery){
                iframe = false;
            }
            //HTML
            else if(/^<\w+>.*/g.test(this.options.content)){
                iframe = false;
            }
            if(iframe){
                if(this.options.isIframe){
                    var iframeNode = document.createElement("iframe");
                    var shame = +new Date();
                    iframeNode.src = this.options.content;
                    iframeNode.id = 'id_' + shame;
                    iframeNode.name = 'name_' + shame;
                    iframeNode.frameBorder = 'no';

                    if (iframeNode.attachEvent){
                        iframeNode.attachEvent("onload", function(){
                            that.options.callback && that.options.callback.call();
                        });
                    }
                    else {
                        iframeNode.onload = function(){
                            that.options.onReady && that.options.onReady.call();
                        };
                    }
                    this.$content.append(iframeNode);
                    this.$content.css("overflow","hidden");
                }
                else{
                    this.$content.load(this.options.content,function(){
                        that.options.onReady && that.options.onReady.call();
                    });
                }
            }
            else{
                this.$content.append(this.options.content);
                this.options.onReady && this.options.onReady.call();
            }
        },
        _destroy:function(){
            this.$content.remove();
        },

        getContent:function(){
            return this.$content;
        },

        show:function(){
            this.$content.show();
        },

        hide:function(){
            this.$content.hide();
        },

        reload:function(c,onReady){
            c && (this.options.content = c);
            onReady && (this.options.onReady = onReady);
            this._destroy();
            this._createBody();
        }
    });
    cri.ContentLoader = ContentLoader;
}(window);

/**
 * Author zhouzy
 * Date   2014/9/23
 *
 * DataGrid
 *
 * 依赖 Grid
 */
!function(window){

    var $   = window.jQuery,
        cri = window.cri;

    var DataGrid = cri.DataGrid = cri.Grid.extend(function(element,options){
        cri.Grid.apply(this,arguments);
        this.$element.attr('data-role','datagrid');
    });

    $.fn.datagrid = function(option) {
        var o = null;
        this.each(function () {
            var $this = $(this),
                dg    = $this.data('datagrid');
            options = typeof option == 'object' && option;
            if(dg != null){
                dg._destroy();
            }
            $this.data('datagrid', (o = new DataGrid(this, options)));
        });
        return o;
    };

}(window);


/*=====================================================================================
 * easy-bootstrap-fileUpload v2.0
 *
 * @author:niyq
 * @date:2013/08/22
 * @dependce:jquery
 *=====================================================================================*/
!function($){

    "use strict";

    var FileUpload = function(element,dataOptions){
        var thisObject = this;
        this.$element = $(element);
        this.dataOptions = $.extend({}, $.fn.fileUpload.defaults, dataOptions);
        this.title = "";
        if(this.$element.attr("title"))
            this.title = this.$element.attr("title");
        if(this.dataOptions.title)
            this.title = this.dataOptions.title;
        this.id = this.$element.attr("id");
        this.name = this.$element.attr("name");
        this.init();
        this.$element.attr('data-role','fileupload');
    };

    FileUpload.prototype.init = function(){
        var thisObject = this;
        this.fileUploadObj = this.$element;                                                     //fileUploadObj
        this.fileUploadObj.wrap($('<div class="eb_fileUploadGroup"></div>'));
        this.parent = this.fileUploadObj.parent();                                              //parent
        this.parent.data('fileUpload',thisObject);
        this.fileUploadObj.after($('<input class="eb_fileUploadInput" name="'+thisObject.name+'" id="eb_fileUploadInput_'+thisObject.id+'" />'));
        this.inputObj = this.parent.children('.eb_fileUploadInput');                             //inputObj
        this.inputObj.data('fileUpload',thisObject);
        this.inputObj.before($('<span class="eb_title">'+thisObject.title+'</span>'));
        this.titleObj = this.parent.children('.eb_title');                                       //titleObj
        this.inputObj.after($('<div class="eb_button">浏览</div>'));
        this.buttonObj = this.parent.children('.eb_button');                                    //buttonObj
        this.fileUploadObj.change(function(){
            var value = thisObject.fileUploadObj.val();
            thisObject.inputObj.val(value);
            thisObject.parent.attr('value',value);
        });
        this.buttonObj.click(function(){
            thisObject.fileUploadObj.trigger('click');
            thisObject.fileUploadObj.get(0).focus();
        }).mousedown(function(){
            setTimeout(function(){
                thisObject.inputObj.addClass('focus');
                thisObject.buttonObj.addClass('focus');
            },1);
        });
        this.setWidth();
        this.setHeight();
        this.setStyle();
    };

    FileUpload.prototype.setValue = function(value){
        this.inputObj.val(value);
        this.fileUploadObj.val(value);
        if(this.fileUploadObjClone)
            his.fileUploadObjClone.val(value);
        this.parent.attr('value',value);
    };

    FileUpload.prototype.getValue = function(){
        var value = this.fileUploadObj.val();
        if(this.fileUploadObjClone)
            value = this.fileUploadObjClone.val();
        return value;
    };

    FileUpload.prototype.clearValue = function(){
        this.setValue('');
    }

    FileUpload.prototype.initInForm = function(formObj){
        var thisObject = this;
        formObj.append(thisObject.fileUploadObjClone = thisObject.fileUploadObj.clone().css('display','none').addClass('clone'));              //fileUploadObjClone
        this.fileUploadObj.click(function(){
            thisObject.fileUploadObjClone.trigger('click');
            return false;
        });
        this.fileUploadObjClone.change(function(){
            var value = $(this).val();
            thisObject.setValue(value);
        });
        return thisObject.fileUploadObjClone;
    };

    FileUpload.prototype.setWidth = function(widthParam){
        var thisObject = this;
        var width = $.fn.fileUpload.defaults.width;
        if(this.dataOptions.width)
            width = this.dataOptions.width;
        if(widthParam)
            width = widthParam;
        if(typeof width == 'string')
            width = width.split("px")[0];
        this.parent.width(width);
        this.inputObj.width(thisObject.parent.width()-140);
        this.fileUploadObj.width(thisObject.parent.width()-75);
        if(this.dataOptions.titleWidth || this.dataOptions.titleWidth == 0){
            var width = this.dataOptions.titleWidth;
            this.titleObj.width(width);
            this.inputObj.width(thisObject.parent.width()-width-67);
            this.fileUploadObj.width(thisObject.parent.width()-width-2);
        }
    };

    FileUpload.prototype.setHeight = function(heightParam){
        var thisObject = this;
        var height = $.fn.fileUpload.defaults.height;
        if(this.dataOptions.height)
            height = this.dataOptions.height;
        if(heightParam)
            height = heightParam;
        if(typeof height == "string")
            height = height.dplit("px")[0];
        this.parent.height(height);
        this.inputObj.height(height-2);
        this.inputObj.css('line-height',(height-2)+'px');
        this.fileUploadObj.height(height);
        this.titleObj.height(height);
        this.titleObj.css('line-height',(height+2)+'px');
        this.buttonObj.height(height);
        this.buttonObj.css('line-height',height+'px');
    };

    FileUpload.prototype.setStyle = function(){
        var thisObject = this;
        this.buttonObj.mouseover(function(){
            $(this).addClass('mouseover');
        }).mouseout(function(){
            $(this).removeClass('mouseover');
        }).mousedown(function(){
            $(this).addClass("mousedown");
        }).mouseup(function(){
            $(this).removeClass("mousedown");
        });
        this.fileUploadObj.focus(function(){
            thisObject.inputObj.addClass('focus');
            thisObject.buttonObj.addClass('focus');
        }).blur(function(){
            thisObject.inputObj.removeClass('focus');
            thisObject.buttonObj.removeClass('focus');
        });
    };

    $.fn.fileUpload = function (option,param) {
        var result = null;
        var thisObj = this.each(function () {
            var $this = $(this)
                , thisObject = $this.data('fileUpload')
                , dataOptions = typeof option == 'object' && option;
            if(typeof option == 'string' ){
                result = thisObject[option](param);
            }else{
                $this.data('fileUpload', (thisObject = new FileUpload(this, dataOptions)));
            }
        });
        if(typeof option == 'string' )return result;
        return thisObj;
    };

    $.fn.fileUpload.defaults = {
        width:250,
        height:20
    };

    $(window).on('load', function(){
        $(".eb_fileUpload").not('.clone').each(function () {
            var thisObj = $(this)
                , dataOptionsStr = thisObj.data('options');
            if(!dataOptionsStr)
                thisObj.fileUpload($.fn.fileUpload.defaults);
            else
                thisObj.fileUpload((new Function("return {" + dataOptionsStr + "}"))());
        });
    });
}(window.jQuery);

/**
 * Author zhouzy
 * Date   2014/9/18
 * Input 组件
 *
 */
!function(window){

    "use strict";

    var cri = window.cri,
        $   = window.jQuery;

    var _defaultOptions = {
        label:null,
        value:null,
        button:null,//button={iconCls:"",handler:""}
        readonly:false,
        onFocus:null,
        onBlur:null,
        enable:true,
        required:false
    };

    var FORM_GROUP    = "form-group",
        INPUT_SELECTOR = "input:not(:button,[type=submit],[type=reset],[disabled])";

    var Input = cri.Widgets.extend(function(element,options){
        this.options = _defaultOptions;
        this.$inputGroup = null;
        this.button = null;
        cri.Widgets.apply(this,arguments);
        this.$element.data('role','input');
    });

    $.extend(Input.prototype,{
        _eventListen:function(){
            var that = this;
            if(this.$element.is(INPUT_SELECTOR)){
                this.$element.on("focus",function(){
                    that.options.onFocus && that.options.onFocus.call(that);
                }).blur(function(){
                    that.options.onBlur && that.options.onBlur.call(that);
                }).on('change', function() {
					that.options.onChange && that.options.onChange.call(that);
				});
            }
            else if(this.$element.is('select')){
                this.$input.click(function(){
                    that.options.onFocus && that.options.onFocus.call(that);
                });
            }
        },

        _init:function(){
            var op = this.options,
                value = this.$element.val();
            if(op.value == null && value != null){
                op.value = value;
            }
            this._createInputGroup();
            if(op.value != null){
                this._setValue(op.value)
            }
        },

        _createInputGroup:function(){
            var $element = this.$element;
            $element.wrap('<div class="'+ FORM_GROUP + '"></div>');
            this.$inputGroup = $element.parent();
            this.$element.wrap('<div class="col-sm-8"></div>');//此处用于 4 8布局的输入框
            this._wrapInput();
            this._label();
            this.options.enable || this.disable();
        },

        _wrapInput:function(){
            var that = this,
                op   = that.options,
                $input = this.$element;
            $input.addClass('form-control');

            if(op.readonly){
                if($input.is(INPUT_SELECTOR)){
                    $input.prop('readonly',true);
                }
                else{
                    var $static = $('<input class="form-control" readonly/>');
                    this.$element.after($static);
                    $input = $static;
                }
            }

            if(op.button){
                $input.wrap('<div class="input-group"></div>');
                var $inputGroup = $input.parent();
                var $inputGroupBtn = $('<span class="input-group-btn"></span>');
                $inputGroup.append($inputGroupBtn);
                this._button($inputGroupBtn);
            }
            this.$input = $input;
        },

        _button:function($p){
            var self = this,
                button = this.options.button;
            if(!cri.isArray(button)){
                button = [button];
            }
            var $button = button.map(function(button){
                var $btn = $('<button class="btn"></button>');
                $btn.btn({
                    text:button.text, iconCls:button.iconCls,
                    handler:function(){
                        button.handler && button.handler.call(this,this.value());
                    }.bind(self)
                });
                return $btn;
            });
            this.button = $p.append($button);
        },

        _label:function(){
            var label = this.options.label ||
                this.$element.data("label") ||
                this.$element.attr("title") ||
                this.$element.attr("name") ||
                "",
                $input = this.$input;
            label = "" + label;
            if(label.length){
                //var $label = $('<label class="control-label">' + label + '</label>');
                var $label = $('<label class="control-label col-sm-4 col-md-4">' + label + '</label>');//用于 4 8 布局的input
                if(this.options.required){
                    $label.addClass('required');
                }
                this.$inputGroup.prepend($label);
            }
        },

        _destroy:function(){
            var $input = this.$element;
            this.$inputGroup.replaceWith($input);
        },

        _setValue:function(value){
            if(value == null){
                return ;
            }
            if(this.$element.is('select')){
                this.$element.val(value);
                this.$input.val(this.$element.find("option:selected").text());
            }
            else if(this.$input.is(INPUT_SELECTOR)){
                this.$input.val(value);
                this.$input.change();
            }
        },

        _getValue:function(){
            return this.$element.val();
        },

        /**
         * @param: errorMsg 异常提示
         * @private
         */
        _showValidateMsg: function(errorMsg){
            this.$inputGroup.addClass("has-error");
            if(!this.$errorMsg){
                this.$errorMsg = $('<span class="help-block">' + errorMsg + '</span>');
                this.$input.after(this.$errorMsg);
            }
            else{
                this.$errorMsg.text(errorMsg);
            }
            this.$errorMsg.show();
        },

        _hideValidateMsg: function(){
            this.$inputGroup.removeClass("has-error");
            this.$errorMsg && this.$errorMsg.hide();
        },

        /**
         * 使输入框不能用
         */
        disable:function(){
            this.$element.prop('disabled',true);
        },

        /**
         * 使输入框可用
         */
        enable:function(){
            this.$element.prop('disabled',false);
        },

        value:function(value){
            if(arguments.length>0){
                this._setValue(value)
            }
            else{
                return this._getValue();
            }
        }
    });
    cri.Input = Input;

    $.fn.input = function(option) {
        var widget = null;
        this.each(function () {
            var $this   = $(this),
                options = typeof option == 'object' && option,
                role    = $this.attr("role");
            widget = $this.data('widget');

            if(widget != null){
                if(widget instanceof Input){
                    widget._destroy();
                }
                else if(widget instanceof cri.TimeInput){
                    widget = null;
                    return ;
                }
            }
            $this.data('widget', (widget = new Input(this, options)));
        });
        return widget;
    };
}(window);

/*=====================================================================================
 * easy-bootstrap-marquee v1.0
 *
 * @author:zhouzy
 * @date:2013/09/16
 * @dependce:jquery
 *=====================================================================================*/
!function($){
    "use strict";

    var Marquee = function (element, options) {
        this.options = $.extend({}, $.fn.marquee.defaults, options);
        this.$element = $(element);
        this.scrollInterval = null;
        this.contentInterval = null;
        this.$one = null;
        this.$two = null;
        this.ita = 0;
        this.init();
    };

    Marquee.prototype = {
        eventListen:function(){
            var that = this;
            this.$element.on("mouseenter",function(){
                clearInterval(that.scrollInterval);
            }).on("mouseleave",function(){
                that.start();
            });
        },

        init:function () {
            var that = this;
            this.ita = 0;
            if(this.options.content.length > 0){
                this.createEle();
                this.contentInterval = window.setInterval(function(){
                    that.start();
                },3000);
                this.eventListen();
            }
        },

        createEle:function(){
            this.$one || this.$element.append("<div class=\"contentOne\"></div>");
            this.$two || this.$element.append("<div class=\"contentTwo\"></div>");
            this.$one = $(".contentOne",this.$element);
            this.$two = $(".contentTwo",this.$element);
            if(this.options.content){
                this.$one.html("<span>" + this.options.content[0].text + "</span>");
                this.$two.html("<span>" + this.options.content[0].text + "</span>");
            }
        },
        start:function(){
            this.ita++;
            this.ita>=this.options.content.length && (this.ita=0);
            this.$two.html("<span>" + this.options.content[this.ita].text + "</span>");
            this.$element.scrollTop(0);
            clearInterval(this.scrollInterval);
            var that = this;
            this.scrollInterval = window.setInterval(function(){
                that.scroll();
            },20);
        },
        stop:function(){
            clearInterval(this.contentInterval);
        },
        scroll:function(){
            this.$element.scrollTop(this.$element.scrollTop() + 1);
            if(this.$element.scrollTop % 20 == 20){
                clearInterval(this.scrollInterval);
            }
        },

        refreshContent:function(param){
            this.options.content = param;
            this.init();
        }
    };

    $.fn.marquee = function (option,param) {
        var result = null;
        var $marquee = this.each(function () {
            var $this = $(this)
                , data = $this.data('marquee')
                , options = typeof option == 'object' && option;
            if(typeof option == 'string' ){
                result = data[option](param);
            }else{
                $this.data('marquee', (data = new Marquee(this, options)));
            }
        });
        if(typeof option == 'string')return result;
        return $marquee;
    };

    $.fn.marquee.defaults = {
        content:[],
        delayTime:3000,
        height:20
    };

    $(window).on('load', function(){
        $("[class='marquee']").each(function () {
            var $this = $(this)
                ,data = $this.data('options');
            if(!data) return;
            $this.marquee((new Function("return {" + data + "}"))());
        });
    });

}(window.jQuery);

/**
 * Author zhouzy
 * Date   2014/10/14
 * notification 组件
 *
 */
!function(window){

    var cri = window.cri,
        $   = window.jQuery;

    var Notification = function(){

    };

    Notification.prototype={
        _notiBody:function(type,message){
            var that = this;
            var icons = {success:"fa-exclamation",error:"fa-exclamation",warming:"fa-exclamation"};
            if(this.$notification && this.$notification.length){
                this._hide(this.$notification);
            }
            var $notification = this.$notification = $('<div class="notification ' + type + '"></div>'),
                $icon = $('<i class="icon fa ' + icons[type]+ '"></i>'),
                $message = $('<span class="message">' + message + '</span>'),
                $btn = $('<i class="btn fa fa-close"></i>').on("click",function(){
                    that._hide($notification);
                });
            $notification.append($icon,$message,$btn);
            $('body').append($notification);
            that._show();
            window.setTimeout(function(){
                //that._hide($notification);
            },1000*5);
        },

        _hide:function($notification){
            $notification.animate({
                height:"hide"
            },function(){
                $notification.remove();
            });
        },

        _show:function(){
            this.$notification.animate({
                height:"show"
            });
        },

        error:function(message){
            this._notiBody("error",message);
        },
        warming:function(message){
            this._notiBody("warming",message);
        },
        success:function(message){
            this._notiBody("success",message);
        }
    }

    cri.notification = new Notification();

}(window);

/**
 * Author zhouzy
 * Date   2014/9/18
 * Input 组件
 *
 */
!function(window){

    "use strict";

    var cri = window.cri,
        $   = window.jQuery;

    var _defaultOptions = {
        label:null,
        value:0,
        readonly:false,
        onFocus:null,
        onBlur:null,
        enable:true,
        required:false,
        max:null,
        min:null,
        step:null,
        button:{}
    };

    var NumberInput = cri.Input.extend(function(element,options){
        this.options = _defaultOptions;
        this.$inputGroup = null;
        cri.Widgets.apply(this,arguments);
        this.$element.attr('data-role','numberInput');
    });

    $.extend(NumberInput.prototype,{
        _eventListen:function(){
            var that = this,
                op   = that.options,
                el = that.$element;
            this.$element.on("focus", function () {
                op.onFocus && op.onFocus.call(that);
                $(document).on("mousewheel DOMMouseScroll", function (e) {
                    var delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) ||  // chrome & ie
                        (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1));              // firefox
                    if(delta > 0){
                        el.val(parseInt(el.val()) + op.step);
                        if(op.max !=null && parseInt(el.val()) > op.max){
                            el.val(op.max);
                        }
                    }else{
                        el.val(parseInt(el.val()) - op.step);
                        if(op.min != null && parseInt(el.val()) < op.min){
                            el.val(op.min);
                        }
                    }
                })
            }).on('blur',function () {
                $(document).off("mousewheel DOMMouseScroll");
                op.onBlur && op.onBlur.call(that);
                if(op.min != null){
                    var val = that.$element.val();
                    if(val == "" || val < op.min){
                        that.value(that.options.min);
                    }
                }
                if(that.options.max != null){
                    var val = that.$element.val();
                    if(val == "" || val > op.max){
                        that.value(that.options.max);
                    }
                }
            }).on("change",function(){
                op.onChange && op.onChange.call(that);
            }).on("keydown",function(e){
                var keycode = e.keyCode || e.which || e.charCode;
                return ((keycode>=48 && keycode<=57) || keycode == 8);
            });
        },

        _button:function($p){
            var that         = this,
                $plusButton  = $('<a href="javascript:void(0)" class="top"><i class="fa fa-sort-up plus-button"></i></a>'),
                $minusButton = $('<a href="javascript:void(0)" class="bottom"><i class="fa fa-sort-down minus-button"></i></a>');
            $p.addClass("input-group-addon").addClass('btn-group-vertical');
            $plusButton.click(function(){
                var val = that.value();
                if(cri.isNum(val)){
                    that.value(+val + 1);
                }
                else{
                    that.value(parseInt(val,10) + 1);
                }
            });
            $minusButton.click(function(){
                var val = that.value();
                if(cri.isNum(val)){
                    that.value(+val - 1);
                }
                else{
                    that.value(parseInt(val,10) - 1);
                }
            });
            $p.append($plusButton,$minusButton);
        },
        value:function(value){
            if(arguments.length>0){
                if(this.options.max != null && value > this.options.max){
                    value = this.options.max
                }
                if(this.options.min != null && value < this.options.min){
                    value = this.options.min
                }
                this._setValue(value)
            }
            else{
                return this._getValue();
            }
        }
    });
    cri.NumberInput = NumberInput;

    $.fn.numberInput = function(option) {
        var widget;
        this.each(function () {
            var $this   = $(this),
                options = typeof option == 'object' && option,
                role    = $this.attr("role");
            widget = $this.data('numberInput');
            if(widget != null && widget instanceof NumberInput){
                widget._destroy();
            }
            $this.data('numberInput', (widget = new NumberInput(this, options)));
        });
        return widget;
    };
}(window);

/**
 * Author zhouzy
 * Date   2014/9/18
 * Pager 组件
 *
 */
!function(window){

    "use strict";

    var cri = window.cri,
        $   = window.jQuery;

    /**
     * 默认属性
     * @type {{page: number, pageSize: number, total: number}}
     * @private
     */
    var _defaultOptions = {
        page:1,      //当前页数
        pageSize:10, //每页条数
        total:0,     //总条数
        onPage:null,  //当用户点击翻页按钮时触发
        onUpdate:null //更新翻页信息结束触发
    };

    var FIRSTPAGE = "first-page",
        PREVPAGE  = "prev-page",
        NEXTPAGE  = "next-page",
        LASTPAGE  = "last-page",
        STATEDISABLED = "disabled",
        ACTIVE   = "active";

    var Pager = cri.Widgets.extend(function(element,options){
        this.options = _defaultOptions;
        this.pager = null;
        cri.Widgets.apply(this,arguments);
    });

    $.extend(Pager.prototype,{
        _eventListen:function(){
            var that = this;
            this.$pager.find('li').off('click');
            this.$pager.find('li:not(.'+STATEDISABLED+')').on("click",function(e){
                var $li = $(e.target).closest("li");
                var page = $li.data("page");
                that._page(page);
            });
        },

        _init:function () {
            this._createPager(this.$element);
        },

        _createPager:function($parent){
            var $pager   = this.$pager = $("<ul></ul>").addClass("pagination"),
                op       = this.options,
                pageSize = op.pageSize || 10,
                total    = op.total || 0,
                page     = parseInt(op.page) || 1,
                lastPage = Math.ceil(total / pageSize),

                $firstPage  = $('<li></li>').addClass(FIRSTPAGE).append('<a href="#"><span class="fa fa-angle-double-left"></span></a>'),
                $prevPage   = $('<li></li>').addClass(PREVPAGE).append('<a href="#"><span class="fa fa-angle-left"></span></a>'),
                $nextPage   = $('<li></li>').addClass(NEXTPAGE).append('<a href="#"><span class="fa fa-angle-right"></span></a>'),
                $lastPage   = $('<li></li>').addClass(LASTPAGE).append('<a href="#"><span class="fa fa-angle-double-right"></span></a>');

            lastPage = lastPage>0?lastPage:page;
            this._fourBtn($firstPage,$prevPage,$nextPage,$lastPage,page,lastPage);
            $pager.append($firstPage,$prevPage,$nextPage,$lastPage);
            $prevPage.after(this._numberPage(page,lastPage));
            $parent.append($pager);
        },

        _updatePagerBtn:function(){
            var op       = this.options,
                pageSize = op.pageSize || 10,
                total    = op.total || 0,
                page     = parseInt(op.page) || 1,
                lastPage = Math.ceil(total / pageSize),

                $firstPage  = $("." + FIRSTPAGE,this.$pager),
                $prevPage   = $("." + PREVPAGE,this.$pager),
                $nextPage   = $("." + NEXTPAGE,this.$pager),
                $lastPage   = $("." + LASTPAGE,this.$pager),

                $numberPage = $(".number",this.$pager);

            this._fourBtn($firstPage,$prevPage,$nextPage,$lastPage,page,lastPage);
            $numberPage.remove();
            $prevPage.after(this._numberPage(page,lastPage));
        },

        _fourBtn:function($firstPage,$prevPage,$nextPage,$lastPage,page,lastPage){
            var nextPage = page + 1,
                prevPage = page - 1;
            if(page <= 1){
                $firstPage.addClass(STATEDISABLED);
                $prevPage.addClass(STATEDISABLED);
            }
            else{
                $firstPage.removeClass(STATEDISABLED).data("page",1);
                $prevPage.removeClass(STATEDISABLED).data("page",prevPage);
            }

            if(page >= lastPage){
                $nextPage.addClass(STATEDISABLED);
                $lastPage.addClass(STATEDISABLED);
            }else{
                $nextPage.removeClass(STATEDISABLED).data("page",nextPage);
                $lastPage.removeClass(STATEDISABLED).data("page",lastPage);
            }
        },

        _numberPage:function(page,lastPage){
            var start = page > 2 ? page-2:1,
                end   = start + 4,
                numberPage = [];
            start = lastPage > 4 ? (end > lastPage ? lastPage - 4:start):start;
            for(var i=start; i<=end && i<=lastPage; i++){
                var $li = $('<li class="number"></li>').data("page",i),
                    $a  = $('<a href="javascript:void(0);"></a>').text(i);
                i != page ? $li.addClass("pager-num"): $li.addClass(ACTIVE);
                numberPage.push($li.append($a));
            }
            return numberPage;
        },

        _page:function(page){
            var op = this.options;
            op.page = page;
            this.options.onPage.call(this,op.page,op.pageSize);
        },

        update:function(page,pageSize,total){
            var op = this.options;
            if(total !== undefined || total !== null){
                op.total = total;
            }
            op.page = page || op.page;
            op.pageSize = pageSize || op.pageSize;
            this._updatePagerBtn();
            this._eventListen();
            op.onUpdate && op.onUpdate(this);
        }
    });
    cri.Pager = Pager;
}(window);
/**
 * Author zhouzy
 * Date   2014/9/18
 * SelectBox 组件
 *
 */
!function(window){

    "use strict";

    var cri = window.cri,
        $   = window.jQuery;

    var SELECTBOX_GROUP = "selectBox-group",
        SELECTBOX_BTN   = "fa fa-caret-down",
        OPTIONS  = "options",
        SELECTED = "selected";

    var _defaultOptions = {
        label    : '',
        data     : null,  //Array [{value:"",text:""},{value:"",text:""}]
        change   : null, //Function: call back after select option
        value    : null,
        enable   : true,
        multiple : false
    };

    var SelectBox = cri.Widgets.extend(function(element,options){
        this.options = _defaultOptions;
        this.$selectBoxGroup = null;
        this.input = null;
        this.listView = null;
        this._value = null;
        this._text = null;
        cri.Widgets.apply(this,arguments);
        this.$element.attr('data-role','selectBox');
    });

    $.extend(SelectBox.prototype,{
        _init:function(){
            this._create();
            var value = this.options.value || this.$element.val();
            if(value != null){
                this.value(value);
            }
        },

        _create:function(){
            this.$element.hide();
            this.options.multiple && this.$element.attr('multiple','multiple');
            this._createInput();
            this.$selectBoxGroup = this.$element.closest('.form-group');
            this._createListView();
            this.$selectBoxGroup.addClass(SELECTBOX_GROUP);
        },

        _createInput:function(){
            var that = this,
                button = {
                    iconCls:SELECTBOX_BTN,
                    handler:function(){
                        that.listView.toggle();
                    }
                };
            this.input = new cri.Input(this.$element,{
                label:that.label,
                readonly:true,
                button:button,
                enable:this.options.enable,
                onFocus:function(){
                    that.listView.toggle();
                }
            });
        },

        _createListView:function(){
            var that = this;
            this.listView = new ListView(this.$selectBoxGroup,{
                data:that._data(),
                multiple:that.options.multiple,
                onChange:function(value,text){
                    if(that.options.multiple) {
                        that._value = value;
                        that._text  = text;
                        that.input.value(value);
                    }
                    else{
                        that._value = value[0];
                        that._text  = text;
                        that.input.value(value[0]);
                    }
                    that.options.change && that.options.change.call(that);
                }
            });
        },

        /**
         * 获取options定义
         * 1.初始化时定义
         * 2.原始select元素options获取
         * @private
         */
        _data:function(){
            var data = this.options.data;
            if(!data){
                data = [];
                $("option",this.$element).each(function(){
                        var text = $(this).text();
                        var value = this.value;
                        data.push({text:text,value:value});
                    }
                );
            }
            else{
                var option = [];
                for(var i= 0,len=data.length;i<len;i++){
                    option.push('<option value="' + data[i].value + '">' + data[i].text + '</option>');
                }
                this.$element.html(option.join(""));
            }
            this.options.data = data;
            return data;
        },

        /**
         * 设置原生元素select option
         * @param optionsArr [{value:value,text:text}]
         * @private
         */
        _setSelectOptions:function(optionsArr){
            var $select = this.$element;
            if($select.is("select")){
                $select.empty();
                for(var i = 0,len=optionsArr.length;i<len;i++){
                    var option = optionsArr[i];
                    $select.append('<option value="' + option.value + '">' + option.text + '</option>');
                }
            }
        },

        /**
         * 根据value值获取对应的text值
         * @param value
         * @private
         */
        _getTextByValue:function(value){
            var data = this.options.data;
            for(var i= 0,len=data.length; i<len; i++){
                if(data[i].value === value){
                    return data[i].text;
                }
            }
        },

        /**
         * @param: errorMsg 异常提示
         * @private
         */
        _showValidateMsg: function(errorMsg){
            this.input && this.input._showValidateMsg(errorMsg);
        },

        /**
         * 隐藏errorMsg 异常异常
         * @private
         */
        _hideValidateMsg: function(){
            this.input && this.input._hideValidateMsg();
        },

        /**
         * 销毁组件
         * @private
         */
        _destroy:function(){
            this.listView._destroy();
            this.$selectBoxGroup.replaceWith(this.$element);
            this.input = null;
            this.listView = null;
        },

        /**
         * 使输入框不能用
         */
        disable:function(){
            this.input.disable();
        },

        /**
         * 使输入框可用
         */
        enable:function(){
            this.input.enable();
        },

        /**
         * get or set selectBox value
         * @param value
         * @returns {*}
         */
        value:function(value){
            if(arguments.length>0){
                if(this.options.multiple && !cri.isArray(value)){
                    value = value.split(',');
                }
                this._value = value;
                this.input.value(this._value);
                this.listView.select(this._value);
                this.options.change && this.options.change.call(this);
            }
            else{
                return this._value;
            }
        },

        /**
         * get or set selectBox text
         * @param text
         * @returns {*}
         */
        text:function(text){
            var data = this.options.data;
            if(arguments.length>0){
                if(this.options.multiple && !cri.isArray(text)){
                    text = text.split(',');
                }
                this._text = text;
                this._value = [];
                for(var i= 0,len = data.length;i<len;i++){
                    for(var j= 0,len=text.length;j<len;j++){
                        if(data[i].text === text[j]){
                            this._value.push(data[i].value);
                            break;
                        }
                    }
                }
            }
            else{
                return this._text;
            }
        },

        /**
         * 动态改变selectBox的options
         * @param options
         */
        setOptions:function(options){
            this.options.data = options;
            this._data();
            this._setSelectOptions(options);
            options.length && this.value(options[0].value);
            this.listView._destroy();
            this._createListView();
        },

        /**
         * 选择第几个下拉选项
         * @param index
         */
        select:function(index){
            index = parseInt(index) || 0;
            index>=0 && index<this.options.data.length && this.value(this.options.data[index].value);
        }
    });

    var ListView = function($parent,options){
        this.options = $.extend({
            data:[],
            onChange:null,
            multiple:false
        },options);
        this.value = options.value || null;//下拉框初始值
        this.text = null;
        this.$options = null;
        this.$parent = $parent;
        this._init();
    };

    ListView.prototype = {
        /**
         * 初始化下拉选择框
         * @returns {*|HTMLElement}
         * @private
         */
        _init:function(){
            var that = this,
                data = this.options.data,
                $options = this.$options = $('<ul class="list-group ' + OPTIONS + '"></ul>'),
                selectedQuery = "."+SELECTED;
            if(data){
                for(var i = 0,len = data.length; i<len; i++){
                    $options.append(this._createOption(data[i]));
                }
            }
            $options.find('li').on('click',function(){
                var $this = $(this);
                var texts = [];
                var values = [];
                if(that.options.multiple){
                    $this.toggleClass(SELECTED);
                }
                else if(!$this.is(selectedQuery)){
                    $options.find(selectedQuery).removeClass(SELECTED);
                    $this.addClass(SELECTED);
                    that.toggle();
                }
                else{
                    return false;
                }
                $options.find('li'+selectedQuery).each(function(){
                    values.push(this.getAttribute("data-value"));
                    texts.push(this.innerHTML);
                });
                that.value = values;
                that.text = texts;
                that._change();
            });
            $('body').append($options);
        },

        /**
         * 构造单个option
         * @param option
         * @private
         */
        _createOption:function(option){
            return $('<li class="list-group-item" data-value="'+option.value+'">'+option.text+'</li>');
        },

        /**
         * 设置position显示时在屏幕中的位置
         * @private
         */
        _setPosition:function(){
            var labelWidth = this.$parent.find('label').outerWidth();
            var width = this.$parent.find('.input-group').outerWidth();
            var parentOffset = this.$parent.offset();
            var left = parentOffset.left + labelWidth + 15;
            var top = parentOffset.top;
            var bottom = $(window).height() - top;
            var scrollHeight = document.body.scrollHeight;
            this.$options.removeClass('show-on-above');
            if(top + 200 > scrollHeight){
                this.$options.addClass('show-on-above');
                this.$options.css({bottom:bottom,left:left,top:'auto',width:width});
            }
            else{
                this.$options.css({top:top + 34,left:left,bottom:'auto',width:width});
            }
        },

        /**
         * 当在非本元素范围内点击，收缩下拉框
         * @private
         */
        _clickBlank:function(){
            var that = this;
            $(document).mouseup(function(e) {
                var _con = that.$options;
                if (!_con.is(e.target) && _con.has(e.target).length === 0) {
                    that.$options.removeClass('open');
                }
            });
        },

        /**
         * 单击option触发
         * @param e
         * @private
         */
        _change:function(){
            this.options.onChange && this.options.onChange.call(this,this.value,this.text);
        },

        /**
         * 根据值设置下拉面板的选择项
         * @param value []
         */
        select:function(value){
            var data = this.options.data;
            var $options = this.$options;
            value = cri.isArray(value) || [value];
            if(data){
                $options.children().removeClass(SELECTED);
                for (var i in value){
                	if(value[i] !== ""){
						$options.find('li[data-value='+value[i]+']').addClass(SELECTED);
					}
					else{
						$options.find('li:eq(0)').addClass(SELECTED);
					}
                }
            }
        },

        /**
         * 显示隐藏切换options选择框
         */
        toggle:function(){
            var that = this;
            this._setPosition();
            this.$options.toggleClass('open');
            if(this.$options.is('.open')){
                that._clickBlank();
            }
        },

        /**
         * 销毁ListView
         */
        _destroy:function(){
            this.$options.remove();
        }
    };

    cri.SelectBox = SelectBox;

    $.fn.selectBox = function(option) {
        var o = null;
        this.each(function () {
            var $this = $(this),
                options = typeof option == 'object' && option;
            o = $this.data('selectBox');
            if(o != null){
                o._destroy();
            }
            $this.data('selectBox', (o = new SelectBox(this, options)));
        });
        return o;
    };
}(window);
/**
 * Author zhouzy
 * Date   2014/12/26
 *
 * TabPage
 */

!function(window){

    "use strict";

    var cri = window.cri,
        $   = window.jQuery;

    var TABPAGE_GROUP     = "tabPage-group",
        TABPAGE_HEADER    = "tabPage-header",
        TABPAGE_HEADER_LB = "tabPage-header-leftBtn",
        TABPAGE_HEADER_RB = "tabPage-header-rightBtn",
        TABPAGE_TABS_WRAP = "tabPage-header-tabs-wrap",
        TABPAGE_TABS      = "tabPage-header-tabs",
        TABPAGE_TAB       = "tabPage-header-tab",
        TABPAGE_TAB_CLOSE = "tabPage-header-tab-close",
        TAB_WIDTH         = 150;

    var _defaultOptions = {
        onFocus:null,
        onCloseTab:null
    };

    var TabPage = cri.Widgets.extend(function(element,options){
        this.options = _defaultOptions;
        this.$tabPageGroup = null;
        this.$tabs = null;
        this._pageBodyQueue = [];
        cri.Widgets.apply(this,arguments);
        this.$element.attr('data-role','tabpage');
    });

    $.extend(TabPage.prototype,{

        _init:function(){
            this._create();
        },

        _create:function(){
            this.$tabPageGroup = this.$element.addClass(TABPAGE_GROUP);
            var contents = [];
            this.$element.children().each(function(){
                contents.push($(this).detach());
            });
            this._createHeader();
            if(contents.length>0){
                for(var i=0; i<contents.length; i++){
                    this.addTab(contents[i],(contents[i].data("title")|| ""),contents[i].data("close"));
                }
            }
        },

        _createHeader:function(){
            var that = this,
                $pageHeader = this.$pageHeader = $('<div class="' + TABPAGE_HEADER + '"></div>'),
                $leftBtn    = this.$leftBtn = $('<i class="fa fa-angle-double-left ' + TABPAGE_HEADER_LB + '"></i>').hide(),
                $rightBtn   = this.$rightBtn = $('<i class="fa fa-angle-double-right ' + TABPAGE_HEADER_RB + '"></i>').hide(),
                $tabsWrap   = this.$tabsWrap = $('<div class="' + TABPAGE_TABS_WRAP + '"></div>');
            $leftBtn.click(function(){
                that._offsetL();
            });
            $rightBtn.click(function(){
                that._offsetR();
            });
            $pageHeader.append($leftBtn,$rightBtn);
            $pageHeader.append($tabsWrap);
            $tabsWrap.append(this._createTabs());
            this.$tabPageGroup.append($pageHeader);
        },

        _offsetL:function(){
            var left = this.$tabs.position().left,
                width = this.$tabs.width(),
                containerWidth = this.$tabsWrap.width();
            if(width+left > containerWidth && !this.$tabs.is(":animated")){
                this.$tabs.animate({left:"-=150px"},500);
            }
        },

        _offsetR:function(){
            var left  = this.$tabs.position().left;
            if(left < 0 && !this.$tabs.is(":animated")){
                this.$tabs.animate({left:"+=150px"},500);
            }
        },

        _createTabs:function(){
            this.$tabs = $('<ul class="' + TABPAGE_TABS + '"></ul>');
            return this.$tabs;
        },

        _closeTab:function($tab){
            var index = $tab.data('for');
            if(index != undefined && index != null){
                this._pageBodyQueue[index]._destroy();
                if(this.options.onCloseTab){
                    this.options.onCloseTab && this.options.onCloseTab.call(this,this._pageBodyQueue[index]);
                }
                this._pageBodyQueue[index]=null;
                this._pageBodyQueue.splice(index,1);
                $('li:gt('+ index +')',this.$tabs).each(function(){
                    var index = +$(this).data("for");
                    $(this).data("for",index-1);
                });
                $tab.remove();
                if($(".selected",this.$tabs).length == 0){
                    if(index == this._pageBodyQueue.length){
                        index -= 1;
                    }
                    index >= 0 && this.focusTab(this._getTab(index));
                }
                this._leftRightBtn();
            }
        },

        _leftRightBtn:function(){
            var $tabs = this.$tabs;
            var tabsW = this._pageBodyQueue.length * TAB_WIDTH;
            var tabpageHeaderW = this.$pageHeader.width();

            $tabs.width(this._pageBodyQueue.length*TAB_WIDTH);

            if(tabsW > tabpageHeaderW){
                this.$leftBtn.show();
                this.$rightBtn.show();
                this.$pageHeader.addClass("shift");
            }
            else{
                this.$leftBtn.hide();
                this.$rightBtn.hide();
                this.$pageHeader.removeClass("shift");
            }
        },

        _getTab:function(index){
            return $('li:eq('+index+')',this.$tabs);
        },

        addNewTab:function(content,title,closeAble,isIframe,callBack){
            title = title || 'New Tab';
            if(closeAble == undefined || closeAble == null || closeAble == "null"){
                closeAble = true;
            }
            var that = this,
                $tabs = this.$tabs,
                $tab = $('<li class="' + TABPAGE_TAB + '">' + title + '</li>')
                    .data("for",this._pageBodyQueue.length)
                    .click(function(){
                        that.focusTab($(this));
                    }
                ),
                $closeBtn = $('<i class="fa fa-close ' + TABPAGE_TAB_CLOSE + '"></i>').click(function(){
                    that._closeTab($tab);
                });
            closeAble && $tab.append($closeBtn);
            $tabs.append($tab);
            var tabPageBody = new cri.ContentLoader(this.$tabPageGroup,{
                content:content,
                isIframe:isIframe,
                onReady:callBack
            });
            this._pageBodyQueue.push(tabPageBody);
            this._leftRightBtn();
            this.focusTab($tab);
            return tabPageBody;
        },

        /**
         * 增加Tab
         * @param content : html字符串、url、jquery对象
         * @param title : tab name
         * @param closeAble: 是否在该tab上提供关闭按钮
         */
        addTab:function(content,title,closeAble,isIframe,callBack){
            var index = this.getIndexByContent(content);
            if(index>-1){
                this.select(index);
                return this.getTabBody(index);
            }else{
                return this.addNewTab(content,title,closeAble,isIframe,callBack);
            }
        },

        /**
         * 根据content判断是否已经打开该TAB
         * @param content
         */
        getIndexByContent:function(content){
            var _pageBodyQueue = this._pageBodyQueue;
            for(var i= 0,len=_pageBodyQueue.length;i<len;i++){
                if(content == _pageBodyQueue[i].options.content){
                    return i;
                }
            }
            return -1;
        },

        focusTab:function($tab){
            var $tabs = this.$tabs,
                index = $(".selected",$tabs).removeClass("selected").data("for"),
                cIndex = $tab.data("for"),
                tabLeft = cIndex * 150,
                tabRight = (cIndex + 1) * 150;

            if(this.$tabs.position().left + tabLeft < 0){
                this.$tabs.stop();
                this.$tabs.animate({left:0-tabLeft},1000);
            }
            if(this.$tabs.position().left + tabRight > this.$tabsWrap.width()){
                this.$tabs.stop();
                this.$tabs.animate({left:this.$tabsWrap.width()-tabRight},1000);
            }
            $tab.addClass("selected");
            index != null && this._pageBodyQueue[index].hide();
            this._pageBodyQueue[$tab.data("for")].show();
            this.options.onFocus && this.options.onFocus.call(this,$tab.data("for"));
        },

        closeTab:function(index){
            this._closeTab(this._getTab(index));
        },

        /**
         * 选择tab并给与焦点
         */
        select:function(index){
            this.focusTab(this._getTab(index))
        },

        /**
         * 根据索引获取tabBody
         */
        getTabBody:function(index){
            return this._pageBodyQueue[index];
        },

        /**
         * 获取TabBody的索引
         */
        getTabBodyIndex:function(tabBody){
            var re = -1;
            $.each(this._pageBodyQueue,function(index){
                if(tabBody == this){
                    re = index;
                    return false;
                }
            });
            return re;
        }
    });

    cri.TabPage = TabPage;

    $.fn.tabPage = function(option) {
        var o = null;
        this.each(function () {
            var $this = $(this),
                options = typeof option == 'object' && option;
            o = $this.data('tabPage');
            if(o != null){
                o._destroy();
            }
            $this.data('tabPage', (o = new TabPage(this,options)));
        });
        return o;
    };
}(window);


/*=====================================================================================
 * easy-bootstrap-textarea v2.0
 *
 * @author:niyq
 * @date:2013/08/22
 * @dependce:jquery
 *=====================================================================================*/
!function($){

    "use strict";

    var Textarea = function(element,dataOptions){
        var thisObject = this;
        this.$element = $(element);
        this.dataOptions = $.extend({}, $.fn.textarea.defaults, dataOptions);
        this.value = this.$element.val();
        this.title="";
        if(this.$element.attr("title"))
            this.title = this.$element.attr("title");
        if(this.dataOptions.title)
            this.title = this.dataOptions.title;
        this.id = this.$element.attr("id");
        this.name = this.$element.attr("name");
        if(this.$element.attr("placeholder"))
            this.placeholder = this.$element.attr("placeholder");
        else
            this.placeholder = "";
        this.init();     //初始化textareaGroup组件
        this.setStyle();
        this.$element.change(function(){
            thisObject.check();
        });
    };

    Textarea.prototype.check = function(){
        var thisObject = this;
        var result = {length:0,result:true};
        var val = this.$element.val();
        if(this.dataOptions.required == true){
            if(!val){
                result['required'] = 'fail';
                result.result = false;
                result.length++;
            }
        }
        return result;
    };

    Textarea.prototype.init = function(){
        var thisObject = this;
        this.$element.wrap($('<div class="eb_textareaGroup" name="'+thisObject.name+'" value="'+thisObject.value+'" data-options="'+thisObject.$element.data('options')+'" id="'+thisObject.id+'_subgroup"></div>'));
        this.parent = this.$element.parent();                 //parent
        this.parent.data('textarea',thisObject);
        this.parent.prepend('<div class="eb_title">'+this.title+'</div>');
        this.titleObj = this.parent.children('.eb_title');          //titleObj
        this.textareaObj = this.$element;                             //textareaObj
        if(this.dataOptions.defaultVal)
            this.textareaObj.val(thisObject.dataOptions.defaultVal);
        //this.textareaObj.attr("id","");
        if(this.dataOptions.required == true){
            this.textareaObj.attr('placeholder',thisObject.placeholder+'（必填）');
            this.parent.append('<span class="redStar">*</span>');
        }
        this.style = this.textareaObj.attr("style");
        this.parent.attr("style",thisObject.style);
        this.setWidth();
        this.setHeight();
        this.setEvent();
    };

    Textarea.prototype.setWidth = function(){
        if(this.dataOptions.width){
            var width = this.dataOptions.width;
            if(typeof width == "string")
                width = width.split("px")[0];
            this.parent.width(width);
            this.textareaObj.width(width-86);
        }
        if(this.dataOptions.titleWidth || this.dataOptions.titleWidth == 0){
            var titleWidth = this.dataOptions.titleWidth;
            if(typeof titleWidth == "string")
                titleWidth = titleWidth.split("px")[0];
            var width = this.parent.width();
            var textareaWidth = width - titleWidth - 13;
            this.textareaObj.width(textareaWidth);
            this.titleObj.width(titleWidth);
        }
    };

    Textarea.prototype.setValue = function(value){
        this.textareaObj.val(value);
        this.parent.attr("value",value);
    };

    Textarea.prototype.getValue = function(){
        return this.textareaObj.val();
    };

    Textarea.prototype.clearValue = function(){
        this.setValue("");
    };

    Textarea.prototype.setHeight = function(){
        if(this.dataOptions.height){
            var height = this.dataOptions.height;
            if(typeof height == "string")
                height = height.split("px")[0];
            this.parent.height(height);
            this.textareaObj.height(height-6);
        }
    };

    Textarea.prototype.setStyle = function(){
        var thisObject = this;
        this.textareaObj.focus(function(){
            thisObject.textareaObj.addClass("focus");
        }).blur(function(){
            thisObject.textareaObj.removeClass("focus");
        });
    };

    Textarea.prototype.check = function(){
        var thisObject = this;
        var result = {length:0,result:true};
        var val = this.$element.val();
        if(this.dataOptions.required == true){
            if(!val){
                result['required'] = 'fail';
                result.result = false;
                result.length++;
            }
        }
        if(this.dataOptions.validtype == 'numOnly'){
            if(!this.setNumOnly()){
                result['numOnly'] = 'fail';
                result.result = false;
                result.length++;
                thisObject.setValue(thisObject.value);
            }else{
                thisObject.value = thisObject.getValue();
            }
        }
        return result;
    };

    Textarea.prototype.setEvent = function(){          //处理绑定事件的方法，包括：onclick,onmousedown,onmouseup,ondblclick,onfocus,onblur,onkeypress,onkeydown,onkeyup,onchange
        var TIMEOUT = 250;
        if(this.dataOptions.dblclickTimeSpan)
            TIMEOUT = this.dataOptions.dblclickTimeSpan;
        var thisObject = this;
        var clickTimeoutId = null,mousedownTimeoutId = null,mouseupTimeoutId = null;
        var clickLock = false,mousedownLock = false,mouseupLock = false;
        if(this.dataOptions.onclickHandler){             //onclick
            if(this.dataOptions.ondblclickHandler){
                if(typeof this.dataOptions.onclickHandler == "string"){
                    this.textareaObj.get(0).onclick = function(){
                        if(!clickLock){
                            clickTimeoutId = setTimeout(window[this.dataOptions.onclickHandler],TIMEOUT);
                            clickLock = true;
                            setTimeout(function(){clickLock=false;},TIMEOUT);
                        }
                    };
                }else{
                    this.textareaObj.get(0).onclick = function(){
                        if(!clickLock){
                            clickTimeoutId = setTimeout(thisObject.dataOptions.onclickHandler,TIMEOUT);
                            clickLock = true;
                            setTimeout(function(){clickLock=false;},TIMEOUT);
                        }
                    };
                }
            }else{
                if(typeof this.dataOptions.onclickHandler == "string"){
                    this.textareaObj.get(0).onclick = window[this.dataOptions.onclickHandler];
                }else{
                    this.textareaObj.get(0).onclick = thisObject.dataOptions.onclickHandler;
                }
            }
        }
        if(this.dataOptions.onmousedownHandler){             //onmousedown
            if(this.dataOptions.ondblclickHandler){
                if(typeof this.dataOptions.onmousedownHandler == "string"){
                    this.textareaObj.get(0).onmousedown = function(){
                        if(!mousedownLock){
                            mousedownTimeoutId = setTimeout(window[this.dataOptions.onmousedownHandler],TIMEOUT);
                            mousedownLock = true;
                            setTimeout(function(){mousedownLock=false;},TIMEOUT);
                        }
                    };
                }else{
                    this.textareaObj.get(0).onmousedown = function(){
                        if(!mousedownLock){
                            mousedownTimeoutId = setTimeout(thisObject.dataOptions.onmousedownHandler,TIMEOUT);
                            mousedownLock = true;
                            setTimeout(function(){mousedownLock=false;},TIMEOUT);
                        }
                    };
                }
            }else{
                if(typeof this.dataOptions.onmousedownHandler == "string"){
                    this.textareaObj.get(0).onmousedown = window[this.dataOptions.onmousedownHandler];
                }else{
                    this.textareaObj.get(0).onmousedown = thisObject.dataOptions.onmousedownHandler;
                }
            }
        }
        if(this.dataOptions.onmouseupHandler){             //onmouseup
            if(this.dataOptions.ondblclickHandler){
                if(typeof this.dataOptions.onmouseupHandler == "string"){
                    this.textareaObj.get(0).onmouseup = function(){
                        if(!mouseupLock){
                            mouseupTimeoutId = setTimeout(window[this.dataOptions.onmouseupHandler],TIMEOUT);
                            mouseupLock = true;
                            setTimeout(function(){mouseupLock=false;},TIMEOUT);
                        }
                    };
                }else{
                    this.textareaObj.get(0).onmouseup = function(){
                        if(!mouseupLock){
                            mouseupTimeoutId = setTimeout(thisObject.dataOptions.onmouseupHandler,TIMEOUT);
                            mouseupLock = true;
                            setTimeout(function(){mouseupLock=false;},TIMEOUT);
                        }
                    };
                }
            }else{
                if(typeof this.dataOptions.onmouseupHandler == "string"){
                    this.textareaObj.get(0).onmouseup = window[this.dataOptions.onmouseupHandler];
                }else{
                    this.textareaObj.get(0).onmouseup = thisObject.dataOptions.onmouseupHandler;
                }
            }
        }
        if(this.dataOptions.ondblclickHandler){             //ondblclick
            if(typeof this.dataOptions.ondblclickHandler == "string"){
                this.textareaObj.get(0).ondblclick = function(){
                    if(clickTimeoutId){
                        clearTimeout(clickTimeoutId);
                        clickTimeoutId = null;
                    }
                    if(mousedownTimeoutId){
                        clearTimeout(mousedownTimeoutId);
                        mousedownTimeoutId = null;
                    }
                    if(mouseupTimeoutId){
                        clearTimeout(mouseupTimeoutId);
                        mouseupTimeoutId = null;
                    }
                    window[thisObject.dataOptions.ondblclickHandler]();
                };
            }else{
                this.textareaObj.get(0).ondblclick = function(){
                    if(clickTimeoutId){
                        clearTimeout(clickTimeoutId);
                        clickTimeoutId = null;
                    }
                    if(mousedownTimeoutId){
                        clearTimeout(mousedownTimeoutId);
                        mousedownTimeoutId = null;
                    }
                    if(mouseupTimeoutId){
                        clearTimeout(mouseupTimeoutId);
                        mouseupTimeoutId = null;
                    }
                    thisObject.dataOptions.ondblclickHandler();
                };
            }
        }
        if(this.dataOptions.onfocusHandler){                //onfocus
            if(typeof this.dataOptions.onfocusHandler == "string"){
                this.textareaObj.get(0).onfocus = window[this.dataOptions.onfocusHandler];
            }else{
                this.textareaObj.get(0).onfocus = this.dataOptions.onfocusHandler;
            }
        }
        if(this.dataOptions.onblurHandler){                //onblur
            if(typeof this.dataOptions.onblurHandler == "string"){
                this.textareaObj.get(0).onblur = window[this.dataOptions.onblurHandler];
            }else{
                this.textareaObj.get(0).onblur = this.dataOptions.onblurHandler;
            }
        }
        if(this.dataOptions.onkeypressHandler){                //onkeypress
            if(typeof this.dataOptions.onkeypressHandler == "string"){
                this.textareaObj.get(0).onkeypress = window[this.dataOptions.onkeypressHandler];
            }else{
                this.textareaObj.get(0).onkeypress = this.dataOptions.onkeypressHandler;
            }
        }
        if(this.dataOptions.onkeydownHandler){                //onkeydown
            if(typeof this.dataOptions.onkeydownHandler == "string"){
                this.textareaObj.get(0).onkeydown = window[this.dataOptions.onkeydownHandler];
            }else{
                this.textareaObj.get(0).onkeydown = this.dataOptions.onkeydownHandler;
            }
        }
        if(this.dataOptions.onkeyupHandler){                //onkeyup
            if(typeof this.dataOptions.onkeyupHandler == "string"){
                this.textareaObj.get(0).onkeyup = window[this.dataOptions.onkeyupHandler];
            }else{
                this.textareaObj.get(0).onkeyup = this.dataOptions.onkeyupHandler;
            }
        }
        if(this.dataOptions.onchangeHandler){                //onchange
            if(typeof this.dataOptions.onchangeHandler == "string"){
                this.textareaObj.get(0).onchange = window[this.dataOptions.onchangeHandler];
            }else{
                this.textareaObj.get(0).onchange = this.dataOptions.onchangeHandler;
            }
        }
    };

    $.fn.textarea = function (option,param) {
        var result = null;
        var thisObj = this.each(function () {
            var $this = $(this)
                , thisObject = $this.data('textarea')
                , dataOptions = typeof option == 'object' && option;
            if(typeof option == 'string' ){
                result = thisObject[option](param);
            }else{
                $this.data('textarea', (thisObject = new Textarea(this, dataOptions)));
            }
        });
        if(typeof option == 'string' )return result;
        return thisObj;
    };

    $.fn.textarea.defaults = {
        required:false,
        dblclickTimeSpan:250,
        width:250,
        height:90,
        titleWidth:73
    };

    $(window).on('load', function(){
        $(".eb_textarea").each(function () {
            var thisObj = $(this)
                , dataOptionsStr = thisObj.data('options');
            if(!dataOptionsStr)
                thisObj.textarea($.fn.textarea.defaults);
            else
                thisObj.textarea((new Function("return {" + dataOptionsStr + "}"))());
        });
    });
}(window.jQuery);

/**
 * Author zhouzy
 * Date   2014/9/18
 * TimeInput 组件
 * 依赖Input组件
 */
!function(window){

    "use strict";

    var cri = window.cri,
        $   = window.jQuery;

    var TIME_INPUT_GROUP = "time-input-group",
        TIME_BOX         = "time-box",
        TIME_INPUT_ICON  = "fa fa-table";

    /**
     * 获取某年的月份数组
     * @param year
     * @returns {number[]}
     */
    function getMonthArr (year){
        if(cri.isLeapYear(year))
            return [31,29,31,30,31,30,31,31,30,31,30,31];
        else
            return [31,28,31,30,31,30,31,31,30,31,30,31];
    }

    var _defaultOptions = {
        value:null,
        format:"yyyy/MM/dd",
        HMS:false,
        enable:true
    };

    var TimeInput = cri.Widgets.extend(function(element,options){
        this.options = _defaultOptions;
        this.date  = null;
        this.input = null;
        this.selectView = null;
        cri.Widgets.apply(this,arguments);
        this.$element.attr('data-role','timeInput');
    });

    TimeInput.prototype._init = function(){
        if(this.options.format && /hh|ss/.test(this.options.format)){
            this.options.HMS = true;
        }
        this.date = this.options.value || new Date();

        if(!(this.date instanceof Date)){
            this.date = cri.string2Date(this.date)
        }

        this._wrapInput();
        this.$timeInputGroup = this.$element.closest('.input-group').addClass(TIME_INPUT_GROUP);
        this._timeSelectView();
    };

    /**
     * 生成Input
     * @private
     */
    TimeInput.prototype._wrapInput = function(){
        var that = this,
            value = this.date,
            button = {
                iconCls:TIME_INPUT_ICON,
                handler:function(){
                    that.selectView.toggle();
                }
            };

        this.input = new cri.Input(this.$element,{
            readonly:true,
            value:cri.formatDate(value,this.options.format),
            button:button,
            enable:this.options.enable
        });
        this.$element.click(function(){
            that.selectView.toggle();
        });
    };

    /**
     * 日期选择下拉面板
     * @private
     */
    TimeInput.prototype._timeSelectView = function(){
        var that = this,
            date = this.date;
        this.selectView = new TimeSelectView(this.$timeInputGroup,{
            value:date,
            HMS:this.options.HMS,
            onChange:function(){
                that.date = this.getDate();
                that.input.value(cri.formatDate(that.date,that.options.format));
                that.options.change && that.options.change.call(that);
            },
			onClearTime:function(){
				var value = that.input.value();
				that.input.value("");
				if(value){
					that.options.change && that.options.change.call(that);
				}
			}
        });
    };

    /**
     * 设置值
     * @private
     */
    TimeInput.prototype._setValue = function(value){
        this.date = value;
        this.input.value(cri.formatDate(value,this.options.format));
        this.selectView.setDate(value);
    };

    /**
     * 销毁组件
     * @private
     */
    TimeInput.prototype._destroy = function(){
        this.selectView._destroy();
        this.$timeInputGroup.replaceWith(this.$element);
        this.input = null;
        this.selectView = null;
    };

    /**
     * 使输入框不能用
     */
    TimeInput.prototype.disable=function(){
        this.input.disable();
    };

    /**
     * 使输入框可用
     */
    TimeInput.prototype.enable=function(){
        this.input.enable();
    };

    /**
     * 获取格式化后日期字符串
     */
    TimeInput.prototype.getFormatValue = function(){
        return this.$element.val();
    };

    /**
     * 获取设置时间输入框的值
     * @param value String|Date
     * @returns {*|Date}
     */
    TimeInput.prototype.value = function(value){
        if(value == undefined){
            return this.date;
        }
        else{
            if(value instanceof Date){
                this._setValue(value);
            }
            else{
                this._setValue(cri.string2Date(value));
            }
        }
    };

    /**
     * @param: errorMsg 异常提示
     * @private
     */
    TimeInput.prototype._showValidateMsg=function(errorMsg){
        this.input && this.input._showValidateMsg(errorMsg);
    };

    TimeInput.prototype._hideValidateMsg=function(){
        this.input && this.input._hideValidateMsg();
    };

    /**
     * 时间输入框下拉面板
     * @param $parent
     * @param options
     * @constructor
     */
    var TimeSelectView = function($parent,options){
        this.$parent = $parent;
        this.$timeBox = null;
        this.$daySelect = null;
        this.options = $.extend({
            value:new Date(),
            HMS:false,
            onChange:null
        },options);
        this.date = cri.date2Json(this.options.value);
        this._create($parent);
    };

    TimeSelectView.prototype = {
        /**
         * 生成时间选择下拉面板
         * @returns {*|HTMLElement}
         * @private
         */
        _create:function($parent){
            var $timeBox = this.$timeBox = $('<div class="container-fluid ' + TIME_BOX + '"></div>');
            var $titleBar = $('<div class="col-sm-12 col-lg-12 form-inline"></div>');
            var $row = $('<div class="row"></div>');
            $titleBar.append(
                this._yearSelect(),
                this._monthSelect());
            $timeBox.append($row.append($titleBar),this._daySelect());
            if(this.options.HMS == true){
                $timeBox.append($('<div class="row hms-bar form-horizontal"></div>').append(this._hmsSelect()));
				$timeBox.find(".hms-bar .form-group").addClass("form-group-sm");
            }
			$timeBox.append(this._buttons());
            $("body").append($timeBox);
        },

        /**
         * 年份选择
         * @returns {*|jQuery|HTMLElement}
         * @private
         */
        _yearSelect : function(){
            var that = this;
            var date = this.date;
            var $yearInputGroup = $('<div class="year-box input-group input-group-sm"></div>');
            var $minusBtn       = $('<span class="input-group-btn"><button class="btn btn-default" type="button">-</button></span>');
            var $plusBtn        = $('<span class="input-group-btn"><button class="btn btn-default" type="button">+</button></span>');
            var $year           = $('<input class="form-control" readonly/>').val(date.yyyy + '年');
            this.$year = $year;
            $minusBtn.on("click",function(){
                $year.val(--that.date.yyyy + '年');
                //that._change();
            });
            $plusBtn.on("click",function(){
                $year.val(++that.date.yyyy + '年');
                //that._change();
            });
            $yearInputGroup.append($minusBtn,$year,$plusBtn);
            return $yearInputGroup;
        },

        /**
         * 月份选择
         * @returns {*|jQuery|HTMLElement}
         * @private
         */
        _monthSelect:function(){
            var that = this,
                date = this.date,
                $inputGroup = $('<div class="month-box input-group input-group-sm"></div>'),
                $select = $('<select class="form-control"></select>');

            this.$month = $select;
            $.each([1,2,3,4,5,6,7,8,9,10,11,12],function(index,value){
                value < 10 && (value = "0" + value);
                $select.append('<option value="' + index + '">' + value + '</option>');
            });
            $select.val(date.MM).on("change",function(){
                that.date.MM = $select.val();
                that._refreshDaySelect();
                //that._change();
            });
            return $inputGroup.append($select,'<span class="input-group-addon">月</span>');
        },

        /**
         * 日期选择
         * @returns {*|jQuery|HTMLElement}
         * @private
         */
        _daySelect:function(){
            var $daySelect = this.$daySelect = $('<table></table>'),
                $week = $('<tr class="week"></tr>'),
                week = {"Sunday":"日","Monday":"一","Tuesday":"二","Wednesday":"三",Thursday:"四","Friday":"五","Saturday":"六"},
                that = this;
            this.$day = $daySelect;

            for(var day in week){
                var $day = $('<th>' + week[day] + '</th>');
                day == "Sunday" && $day.addClass("red");
                day == "Saturday" && $day.addClass("red");
                $week.append($day);
            }
            for(var i=0; i<6; i++){
                var $tr = $('<tr class="days"></tr>');
                for(var j=0; j<7;j++){
                    var $td = $("<td></td>").on("click",function(){
                        var day = $(this).find(".day-content").text();
                        if(day && day!=that.date.dd){
                            $('td.active',$daySelect).removeClass("active");
                            that.date.dd = +day;
                            $(this).addClass("active");
                            //that._change();
                        }
                    });
                    $tr.append($td);
                }
                $daySelect.append($tr);
            }
            this._refreshDaySelect();
            return $daySelect;
        },

        /**
         * 当日期改变后，刷新daySelect
         * @private
         */
        _refreshDaySelect:function(){
            var date   = this.date,
                maxDay = getMonthArr(date.yyyy)[date.MM],
                shift  = new Date(date.yyyy,date.MM,1).getDay();
            $('td.active',this.$daySelect).removeClass("active");
            $('tr.days td',this.$daySelect).html("");
            for(var i=shift;i<maxDay+shift;i++){
                var rows = i%7,
                    cols = Math.floor(i/7),
                    $td = $('tr.days:eq("'+cols+'") td:eq("' + rows + '")',this.$daySelect),
                    day = i- shift + 1;
                $td.append('<div class="day-content">' + day + '</div>');
                day == this.date.dd && $td.addClass("active");
            }
        },

        /**
         * 时间选择
         * @returns {*|jQuery|HTMLElement}
         * @private
         */
        _hmsSelect:function(){
            var that = this,
                $hour   = $('<input class="form-control hour"/>'),
                $minute = $('<input class="form-control minute"/>'),
                $second = $('<input class="form-control second"/>'),
            	$hourForm = $("<div class='col-sm-4'></div>").append($hour),
				$minuteForm = $("<div class='col-sm-4'></div>").append($minute),
				$secondForm = $("<div class='col-sm-4'></div>").append($second);

            this.hour = $hour.numberInput({
                min:0,
                max:23,
                value:this.date.HH,
                onChange:function(){
                    that.date.HH = this.value();
                    //that._change();
                }
            });
            $hour.before('<span class="input-group-addon">时</span>');
            this.minute = $minute.numberInput({
                min:0,
                max:59,
                value:this.date.mm,
                onChange:function(){
                    that.date.mm = this.value();
                    //that._change();
                }
            });
            $minute.before('<span class="input-group-addon">分</span>');
            this.second = $second.numberInput({
                min:0,
                max:59,
                value:this.date.ss,
                onChange:function(){
                    that.date.ss = this.value();
                    that._change();
                }
            });
            $second.before('<span class="input-group-addon">秒</span>');
            return [$hourForm,$minuteForm,$secondForm];
        },

        _change:function(){
            this.options.onChange && this.options.onChange.call(this);
        },

        /**
         * 设置position显示时在屏幕中的位置
         * @private
         */
        _setPosition:function(){
            var left = this.$parent.offset().left + this.$parent.find('label').outerWidth();
            var top = this.$parent.offset().top + 34;
            var bottom = $(window).height() - this.$parent[0].getBoundingClientRect().bottom + 34;
            var scrollHeight = document.body.scrollHeight;
            this.$timeBox.removeClass('show-on-above');
            if(top + 200 > scrollHeight){
                this.$timeBox.addClass('show-on-above');
				this.$timeBox.css({bottom:bottom,left:left,top:'auto'});
            }
            else{
				this.$timeBox.css({top:top,left:left,bottom:'auto'});
			}
        },

        /**
         * 销毁时间选择面板
         * @private
         */
        _destroy : function(){
            this.$timeBox.remove();
        },

		/**
		 * 生成时间选择面板底部的确认取消按钮
		 * @returns {*|jQuery|HTMLElement}
		 * @private
		 */
		_buttons : function(){
			var that = this;
			var $buttons = $('<div class="rows text-right"></div>');
			var $clearBtn = $('<a href="javascript:void(0)" class="btn btn-xs">清除</a>');
			var $okBtn = $('<a href="javascript:void(0)" class="btn btn-xs">确定</a>');
			$clearBtn.click(function(){
				that.options.onClearTime && that.options.onClearTime();
				//that.toggle();
			});
			$okBtn.click(function(){
				that._change();
				that.toggle();
			});
			$buttons.append($('<div class="btn-group"></div>').append($clearBtn,$okBtn));
			return $buttons;
		},

        /**
         * 展开收缩时间选择面板
         */
        toggle:function(){
            var that = this;
            this._setPosition();
            if(this.$timeBox.is(":hidden")){
                var cb = function(e){
                    var _con = that.$timeBox;
                    if (!_con.is(e.target) && _con.has(e.target).length === 0) {
                        that.$timeBox.slideUp(200);
                        $(document).off('mouseup',cb);
                    }
                };
                if(this.$timeBox.is('.top')){
                    this.$timeBox.show();
                    $(document).on('mouseup',cb);
                }else{
                    this.$timeBox.slideDown(200,function(){
                        $(document).on('mouseup',cb);
                    });
                }
            }
            else{
                this.$timeBox.is('.top') ? this.$timeBox.hide() : this.$timeBox.slideUp(200);
            }
        },

        /**
         * 获取时间选择面板中保存的日期
         * @returns {Date}
         */
        getDate:function(){
            var date = this.date;
            return new Date(date.yyyy,date.MM,date.dd,date.HH,date.mm,date.ss);
        },

        /**
         * 设置时间选择面板各个选择项的值
         * @param date
         */
        setDate:function(date){
            this.date = cri.date2Json(date);
            this.$year.text(this.date.yyyy);
            this.$month.val(this.date.MM);
            this._refreshDaySelect();
            if(this.options.HMS){
                this.hour.value(this.date.HH);
                this.minute.value(this.date.mm);
                this.second.value(this.date.ss);
            }
        }
    };

    $.fn.timeInput = function (option) {
        var widget = null;
        this.each(function () {
            var $this = $(this),
                options = typeof option == 'object' && option;
            widget = $this.data('widget');
            if(widget != null){
                widget._destroy();
            }
            $this.data('widget', (widget = new TimeInput(this, options)));
        });
        return widget;
    };

}(window);

/**
 * Author zhouzy
 * Date   2014/9/18
 * ToolBar 组件
 *
 */
!function(window){

    "use strict";

    var cri = window.cri,
        $   = window.jQuery;

    var _defaultOptions = {
        buttons:[] //按钮组{text:按钮文本,handler:按钮回调函数,iconCls:按钮图标}
    };

    var TOOLBAR = "toolbar";

    function icon(iconCls){
        var $icon = $('<i class="' + iconCls + '"></i>');
        return $icon;
    }
    function button(button){
        var $button = $('<button class="btn btn-sm"></button>');
        button.iconCls && $button.append(icon(button.iconCls));
        button.text && $button.append(button.text);
        button.handler && $button.on("click",button.handler);
        return $button;
    }

    var ToolBar = cri.Widgets.extend(function(element,options){
        this.options = _defaultOptions;
        this.$toolBar = null;
        cri.Widgets.apply(this,arguments);
    });

    $.extend(ToolBar.prototype,{
        _eventListen:function(){},

        _init:function () {
            this._create(this.$element);
        },

        _create:function($parent){
            var op = this.options;
            var buttons = op.buttons;
            var $toolbar = this.$toolBar = $('<div class="btn-toolbar '+TOOLBAR + '"></div>');
            for(var i = 0,len = buttons.length; i<len; i++){
                var btn = buttons[i];
                $toolbar.append(button(btn));
            }
            $parent.append($toolbar);
        }
    });
    cri.ToolBar = ToolBar;
}(window);

/**
 * Author zhouzy
 * Date   2014/9/23
 *
 * Tree
 * 继承 Widgets
 */

!function(window){

    "use strict";

    var $   = window.jQuery,
        cri = window.cri;

    /**
     * 定义表格标题，工具栏，分页高度
     */
    var _titleH    = 31, //标题高度
        _toolbarH  = 31, //工具栏高度
        _iconWidth = 16; //

    var fileIcons = {"file":"icon fa fa-file","folderOpen":"icon fa fa-folder-open","folderClose":"icon fa fa-folder"};

    var _defaultOptions = {
        title:null,
        toolbar:null,
        url:null,
        param:null,
        async:false,
        asyncUrl:null,
        page:true,

        onSelected:null,
        onDblClick:null,
        onLoad:null      //树完成初始化触发
    };

    /**
     * 计算原始元素高度
     * 1.若初始化时，定义了高度属性
     * 2.若设置了高度属性(height)
     * 3.若设置了高度样式
     * 4.都未定义 默认auto
     * @param $ele
     * @param height 初始化时指定的高度
     * @private
     */
    function _getElementHeight($ele,height){
        var styleHeight = $ele[0].style.height,
            propHeight  = $ele[0].height,
            calHeight   = height || styleHeight || propHeight;

        if(calHeight){
            var arr = ("" + calHeight).split("%");
            if(arr.length>1){
                calHeight = Math.floor($ele.parent().height() * arr[0] / 100);
                calHeight -= 2;
            }
            calHeight = (""+calHeight).split("px")[0];
            if(calHeight){
                return parseInt(calHeight);
            }
        }
        else{
            return null;
        }
    }

    /**
     * 1.如果组件初始化时,定义了高宽属性
     * 2.如果table设置了高宽(style)
     * 3.如果table设置了高宽属性
     * 4.都未定义 默认为100%
     * @private
     */
    function _getElementWidth($ele,width){
        var styleWidth = $ele[0].style.width,
            propWidth  = $ele[0].width,
            calWidth   = width || styleWidth || propWidth || "100%";

        var arr = ("" + calWidth).split("%");
        if(arr.length>1){
            return Math.floor($ele.parent().width() * arr[0] / 100);
        }
        calWidth = calWidth.split("px")[0];
        return parseInt(calWidth);
    }

    var Tree = cri.Tree = cri.Widgets.extend(function (element,options) {
        this.options = _defaultOptions;
        this.$tree = null;
        this.$treebody = null;
        this.selectedRow = null;
        this.toolbar = null;
        this.rows = null;
        this._className = "tree";
        cri.Widgets.apply(this,arguments);
        this.$element.attr('data-role','tree');

    });

    $.extend(Tree.prototype,{
        _init:function () {
            var self = this;
            this._getData().then(function(data){
                self.rows = data.rows;
                self._createTree();
                if(self.options.onLoad && typeof(self.options.onLoad) === 'function'){
                    self.options.onLoad.call(self);
                }
            });
        },

        /**
         * 获取数据
         * @returns {boolean}
         * @private
         */
        _getData:function(){
            return $.ajax({
                type: "post",
                url: this.options.url,
                data:this.options.param
            })
        },

        /**
         * 生成tree视图
         * @private
         */
        _createTree:function(){
            var that    = this,
                op      = this.options,
                height  = this.$element._getHeightPixelValue(op.height),
                width   = this.$element._getWidthPixelValue(op.width),
                $tree   = $("<div></div>").addClass(this._className).addClass('panel panel-default').width(width),

                $treeview = this.$treeview = $("<div></div>").addClass("tree-view panel-body"),
                $treebody = this.$treebody = $("<ul></ul>").addClass("tree-body");

            $tree.attr("style",this.$element.attr("style")).show().height(height);
            $treeview.append($treebody);
            if(height){
                this.options.title   && (height -= _titleH);
                this.options.toolbar && (height -= _toolbarH);
                this.$treeview.css("height",height);
            }
            this.$element.wrap($tree);
            this.$element.hide();
            this.$tree = this.$element.parent();
            this._createTitle(this.$tree);
            this._createToolbar(this.$tree);
            this._eachNode($treebody,this.rows,"show",0,0);
            this.$tree.append($treeview);
            this.$treebody
                .on('click',"div.li-content",function(e){
                    that._select(e);
                    that._fold(e);
                    op.onSelected && op.onSelected.call(that,that.selectedRow);
                    return false;
                })
                .on('dblclick', "div.li-content", function(e){
                    that._select(e);
                    op.onDblClick && op.onDblClick.call(that,that.selectedRow);
                    return false;
                });
        },

        /**
         * 递归生成节点
         * 节点默认显示打开
         * @param $li
         * @param children
         * @private
         */
        _appendChildren:function($li,children){
            var $ul    = $("<ul></ul>"),
                uid    = $(".li-content",$li).data('uid') * 1000,
                indent = +($('i',$li).css("marginLeft").split('px')[0]);
            indent += _iconWidth;
            this._eachNode($ul,children,"show",uid,indent);
            $li.append($ul);
        },

        /**
         * 生成每个节点
         * 同步树(当点击fold节点，不查询后台数据)
         * 异步树(当点击fold检点，实时查询后台后代节点)
         * 当为同步树，检查children进行递归生成节点
         * 当为异步树，检查hasChildren,children字段，hasChildren==true && (!children || children.length==0)时，访问后台
         *
         * @param $ul
         * @param data
         * @param isShow
         * @param id
         * @param indent
         * @private
         */
        _eachNode:function($ul,data,isShow,id,indent){
            for(var i = 0,len=data.length; i<len; i++){
                var row      = data[i],
                    $li      = $('<li></li>'),
                    $text    = $('<span class="li-text">' + row.text + '</span>'),
                    $icon    = $('<i class="' + fileIcons.file + '"></i>').css("marginLeft",indent),
                    $content = $('<div class="li-content"></div>').data("uid",++id);
                this._dealNodeData(row);
                $icon.attr("class",fileIcons[row.iconType]);
                $ul.append($li.append($content.append($icon,$text)));
                isShow == "hide" && $li.hide();

                if(row.hasChildren && row.children && row.children.length){
                    var $parent = $("<ul></ul>");
                    $li.append($parent);
                    indent += _iconWidth;
                    row.state && row.state == "close"
                        ? this._eachNode($parent,row.children,"hide",id*1000,indent)
                        : this._eachNode($parent,row.children,isShow,id*1000,indent);
                    indent -= _iconWidth;
                }
            }
        },

        /**
         * 处理node数据的默认值
         * state：默认值open
         * 获取节点图标类型
         * 如果节点指定 hasChildren 则图标显示为文件夹，
         * 如果 children 不存在，则显示为关闭文件夹
         * 如果未指定 state ，则默认为 close
         * @param node
         * @private
         */
        _dealNodeData:function(node){
            node.iconType = "file";
            if(node.children && node.children.length>0){
                node.hasChildren = true;
            }
            if(node.hasChildren){
                if(node["state"] == undefined || node["state"] == null){
                    node["state"] = "open";
                }
                if(node.state && node.state=="open" && node.children && node.children.length>0){
                    node.iconType = "folderOpen";
                }
                else{
                    node.state = "close";
                    node.iconType = "folderClose";
                }
            }
        },

        _createTitle:function($parent){
            if(this.options.title){
                this.$title = $('<div class="title panel-heading"><span>' + this.options.title + '</span></div>');
                $parent.append(this.$title);
            }
        },

        _createToolbar:function($parent){
            if(this.options.toolbar) {
                this.toolbar = new cri.ToolBar($parent, {
                    buttons: this.options.toolbar
                });
            }
        },

        /**
         * 展开、收缩子节点
         * @param e
         * @private
         */
        _fold:function(e){
            var op = this.options,
                that = this,
                item = $(e.target).closest("div"),
                $li = $(e.target).closest("li"),
                $icon = $("i",item);

            $icon.is(".fa-folder")?
                $icon.removeClass("fa-folder").addClass("fa-folder-open"):
                $icon.removeClass("fa-folder-open").addClass("fa-folder");

            if(!that.selectedRow.children && op.async){
                var pa = {};
                $.each(that.selectedRow,function(index,data){
                    index != "children" && (pa[index] = data);
                });
                that.selectedRow.children || $.ajax({
                    type: "get",
                    url: op.asyncUrl,
                    success: function(data){
                        that.selectedRow.children = data.rows;
                        that._appendChildren($li,data.rows);
                    },
                    data:pa,
                    dataType:"JSON",
                    async:false
                });
            }
            else{
                this._expand($li);
            }
        },

        /**
         * 收缩、展开后代节点
         * @param $li
         * @private
         */
        _expand:function($li){
            var $ul = $li.children("ul");
            if($ul.length){
                $ul.children("li").each(function(){
                    $(this).animate({
                        height:"toggle"
                    },100);
                });
            }
        },

        _select:function(e){
            var item = $(e.target).closest("div"),
                uid = item.data('uid');
            this.selectedRow = this._getDataById(uid);
        },

        _getDataById:function(id){
            var row = null;
            !function getRow(data){
                var arr = [];
                while(id >= 1){
                    var t = id%1000;
                    arr.push(t);
                    id = Math.floor(id/1000);
                }
                for(var i = arr.length - 1; i >= 0 ; i--){
                    var k = arr[i] - 1;
                    data[k]&&(row = data[k])&&(data = data[k].children);
                }
            }(this.rows);
            return row;
        },

        getSelected:function(){
            return this.selectedRow;
        },

        reload:function(param){
            param && (this.options.param = param);
            this._init();
        }
    });

    $.fn.tree = function (option) {
        var tree = null;
        this.each(function () {
            var $this   = $(this),
                options = typeof option == 'object' && option;
            $this.data('tree', (tree = new Tree(this, options)));
        });
        return tree;
    };

}(window);

/**
 * Author zhouzy
 * Date   2014/9/23
 *
 * TreeGrid
 *
 * 依赖 Grid
 */
!function(window){

    var $   = window.jQuery,
        cri = window.cri;

    var TreeGrid = cri.TreeGrid = cri.Grid.extend(function(element,options){
        this._gridClassName = "treegrid";
        cri.Grid.apply(this,arguments);
        this._selfEvent();
        this.$element.attr('data-role','treegrid');
    });

    TreeGrid.prototype._selfEvent = function(){
        var that = this;
        this.$gridbody
            .on('click', "tr td.line-file-icon i", function(e){
                that._fold(e);e.preventDefault();
            });
    };

    TreeGrid.prototype._refreshBody = function(){
        var $parent = this.$gridbody,
            $table  = $("<table></table>"),
            op      = this.options,
            columns = this._columns,
            lineNum = 1,
            paddingLeft = 1,
            that = this,
            iconWidth = 6;

        $table.append(this._createColGroup($parent.width()));
        /**
         * 拼装每行HTML
         */
        this._selectedId = [];
        !function getRowHtml(rows,isShow,id){
            for(var i = 0,len = rows.length; i<len; i++){
                var $tr = $("<tr></tr>").data("rowid",++id).attr("data-rowid",id);
                var row = rows[i];

                isShow == "show" || $tr.hide();

                if(op.checkBox){
                    if(row.check){
                        $tr.addClass("selected");
                        $tr.append($("<td></td>").addClass("line-checkbox").append('<input type="checkbox" checked/>'));
                        that._selectedId.push(id);
                    }else{
                        $tr.append($("<td></td>").addClass("line-checkbox").append('<input type="checkbox"/>'));
                    }
                }
                if(op.rowNum){
                    $tr.append($("<td></td>").addClass("line-number").append(lineNum++));
                }

                getColHtml($tr,columns,row,paddingLeft);
                $table.append($tr);

                if(row.children && row.children.length > 0){
                    row.hasChildren = true;
                    paddingLeft += iconWidth;
                    row.state && row.state == "closed" ?
                        getRowHtml(row.children,"hide",id*1000) :
                        getRowHtml(row.children,isShow,id*1000);
                    paddingLeft -= iconWidth;
                }
            }
        }(this._rows,"show",0);

        /**
         * 拼装列HTML
         * @param colDef     列定义
         * @param colData    列数据
         * @param textIndent 文件图标缩进
         * @param nodeId     id
         * @returns {Array}
         */
        function getColHtml($tr,colDef,colData,textIndent){
            var fileIcons = {"file":"fa fa-file","folderOpen":"fa fa-folder-open","folderClose":"fa fa-folder"};

            $.each(colDef,function(index){
                var $td = $("<td></td>");
                var text   = colData[this.field]==null ? "" : colData[this.field];

                if(this.field == "text"){
                    var $icon = $("<i></i>").attr("class",fileIcons.file);
                    if(colData.hasChildren || (colData.children && colData.children.length)){
                        colData.state == "closed" ? $icon.attr("class",fileIcons.folderClose):$icon.attr("class",fileIcons.folderOpen);
                    }
                    $td.css("text-indent",textIndent).addClass("line-file-icon").append($icon).append(text);
                }
                else{
                    $td.text(text);
                }
                $tr.append($td);
            });
        }
        this.$gridbody.removeClass("loading").html($table);
        //fixed IE8 do not support nth-child selector;
        $("tr:nth-child(odd)",$table).css("background","#FFF");
        //根据gird-body 纵向滚动条决定headWrap rightPadding
        var scrollBarW = $parent.width()-$parent.prop("clientWidth");
        this.$gridhead.css("paddingRight",scrollBarW);
    };

    TreeGrid.prototype._fold = function(e){
        var op    = this.options,
            item  = $(e.target).closest("tr"),
            rowid = item.data('rowid'),
            that  = this;
        this.selectedRow = this._getRowDataById(rowid);

        if(this.selectedRow.state == "closed") {
            this.selectedRow.state = "open";
            if(op.async && !this.selectedRow.children){
                var pa = {};
                $.each(this.selectedRow,function(index,data){index != "children" && (pa[index] = data);});
                this.selectedRow.childrenList || $.ajax({
                    type: "post",
                    url: op.asyncUrl,
                    success: function(data, textStatus){
                        that.selectedRow.children = data.rows;
                    },
                    data:pa,
                    dataType:"JSON",
                    async:false
                });
            }
        }
        else{
            this.selectedRow.state = "closed";
        }
        this._refreshBody();
    };

    TreeGrid.prototype._checkbox = function(e){
        var input = $(e.target),
            tr    = $(e.target).closest("tr"),
            rowid = parseInt(tr.data('rowid')),
            id    = rowid,
            row   = this._getRowDataById(rowid),
            isChecked = input.prop("checked");

        !function(data){
            if(data.children && data.children.length > 0){
                id *= 1000;
                !function ita(data){
                    $.each(data,function(){
                        id += 1;
                        $("tr[data-rowid="+ id +"] input[type=checkbox]").prop("checked",isChecked);
                        if(this.children && this.children.length > 0){
                            id*=1000;
                            ita(this.children);
                            id= Math.floor(id/=1000);
                        }
                    });
                }(data.children);
            }
        }(row);
    };

    TreeGrid.prototype._getRowDataById = function(rowid){
        var op = this.options
            ,rowdata = null;
        rowid = parseInt(rowid);

        !function getRow(data){
            var arr = [];
            while(rowid >= 1){
                var t = rowid%1000;
                arr.push(t);
                rowid = Math.floor(rowid/1000);
            }
            for(var i = arr.length - 1; i >= 0 ; i--){
                var k = arr[i] - 1;
                data[k]&&(rowdata = data[k])&&(data = data[k].children);
            }
        }(this._rows);
        return rowdata;
    };

    $.fn.treegrid = function(option) {
        var treeGrid = null;
        this.each(function () {
            var $this    = $(this),
                options  = typeof option == 'object' && option;
            treeGrid = $this.data('treegrid');
            treeGrid && treeGrid.$grid.before($this).remove();
            $this.data('treegrid', (treeGrid = new TreeGrid(this, options)));
        });
        return treeGrid;
    };
}(window);

/**
 * Author zhouzy
 * Date   2014/10/14
 *
 * jQuery 插件基类
 * 继承自Class
 *
 */
!function(window){

    "use strict";

    var cri = window.cri,
        $   = window.jQuery;

    var INPUTSELECTOR = ":input:not(:button,[type=submit],[type=reset],[disabled])",
        NUMBERINPUTSELECTOR = "[role=number],[role=range]";

    var emailRegExp = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i,
        urlRegExp = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,
        telRegExp = /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/i,
        ipRegExp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/i;

    function patternMatcher(value, pattern) {
        if (typeof pattern === "string") {
            pattern = new RegExp('^(?:' + pattern + ')$');
        }
        return pattern.test(value);
    }

    function matcher(input, selector, pattern) {
        var value = input.val();
        if (input.filter(selector).length && value !== "") {
            return patternMatcher(value, pattern);
        }
        return true;
    }

    function hasAttribute(input, name) {
        if (input.length)  {
            return input[0].attributes[name] != null;
        }
        return false;
    }

    var Rules = {
        required: function(input) {
            var checkbox = input.filter("[type=checkbox]").length && !input.is(":checked"),
                value = input.val();

            return !(hasAttribute(input, "required") && (value === "" || !value  || checkbox));
        },
        pattern: function(input) {
            if (input.filter("[role=text]").filter("[pattern]").length && input.val() !== "") {
                return patternMatcher(input.val(), input.attr("pattern"));
            }
            return true;
        },
        min: function(input){
            if (input.filter(NUMBERINPUTSELECTOR).filter("[min]").length && input.val() !== "") {
                var min = parseFloat(input.attr("min")) || 0,
                    val = parseFloat(input.val());
                return min <= val;
            }
            return true;
        },
        max: function(input){
            if (input.filter(NUMBERINPUTSELECTOR).filter("[max]").length && input.val() !== "") {
                var max = parseFloat(input.attr("max")) || 0,
                    val = parseFloat(input.val());
                return max >= val;
            }
            return true;
        },

        email: function(input) {
            return matcher(input, "[role=email]", emailRegExp);
        },
        url: function(input) {
            return matcher(input, "[role=url]", urlRegExp);
        },
        number: function(input) {
            if(input.filter(NUMBERINPUTSELECTOR).length && input.val()){
                return cri.isNum(input.val());
            }
            return true;
        },
        tel: function(input){
            return matcher(input, "[role=tel]", telRegExp);
        },
        ip: function(input){
            return matcher(input, "[role=ip]", ipRegExp);
        }
    };

    var Messages = {
        required:"该值不能为空",
        min:"请输入大于的数字",
        max:"请输入小于的数字",
        email:"请输入有效的邮箱地址",
        url:"请输入有效的URL地址",
        number:"请输入数字",
        tel:"请输入有效的号码",
        pattern:"该值无效,请重新输入",
        ip:'请输入有效IP地址'
    };

    var _defaultOptions = {
        rules : Rules,
        messages:Messages,
        validateOnBlur:false
    };

    var Validator = cri.Widgets.extend(function(element,options){
        this.options = _defaultOptions;
        cri.Widgets.apply(this,arguments);
    });

    $.extend(Validator.prototype,{
        _eventListen:function(){
            /**
             * 如果是表单,在提交时验证
             * 如果设置validateOnBlur,则在input blur事件中验证
             */
            var that = this,
                $element = this.$element;
            if(this.$element.is("form")){
                this.$element.on("submit",function(){
                    that.validate();
                });
            }
            if(that.options.validateOnBlur){
                if(!$element.is(INPUTSELECTOR)){
                    $element.find(INPUTSELECTOR).each(function(){
                        $(this).on("blur",function(){
                            that._validateInput($(this));
                        });
                        if(!$(this).is('[role=timeInput]')){
                            $(this).on("blur",function(){
                                that._validateInput($(this));
                            });
                        }
                    });
                    $element.find("select").each(function(){
                        $(this).on("change",function(){
                            that._validateInput($(this));
                        });
                    });
                }else{
                    $element.on("blur",function(){
                        that._validateInput($element);
                    });
                }
            }
        },

        /**
         * 检查 input 合法性
         * @param $input
         * @private
         */
        _checkValidity:function($input){
            var rules = this.options.rules,
                rule;
            for (rule in rules) {
                if (!rules[rule].call(this, $input)) {
                    return { valid: false, key: rule };
                }
            }
            return { valid: true };
        },

        /**
         * 验证表单或者输入框,
         * 如果传入值，则验证指定的对象
         */
        validate:function($e){
            var that = this,
                $element = $e || this.$element,
                result = true;
            if(!$element.is(INPUTSELECTOR)){
                $element.find(INPUTSELECTOR).each(function(){
                    var isValidity = that._validateInput($(this));
                    result = result && isValidity;
                });
            }else{
                result = result && that._validateInput($element)
            }
            return result;
        },

        /**
         * 验证每个Input
         * @param $input
         * @returns {boolean|Validator._checkValidity.valid|exports.valid|valid}
         * @private
         */
        _validateInput:function($input){
            var that = this,
                result = this._checkValidity($input),
                valid = result.valid;
            if(!valid){
                var errorMsg = this.options.messages[result.key];
                if(result.key == 'min'){
                    errorMsg = '请输入不小于'+ $input.attr('min') + '的数字';
                }
                if(result.key == 'max'){
                    errorMsg = '请输入不大于'+ $input.attr('max') + '的数字';
                }

                this._showMessage($input,errorMsg);
                if($input.is("[readonly=readonly]")){
                    $input.closest(".input-group").one("click",function(){
                        that._hideMessage($input);
                    });
                }
                $input.one("focus",function(){
                    that._hideMessage($input);
                });
            }else{
                this._hideMessage($input);
            }
            return valid;
        },

        _showMessage:function($input,errorMsg){
            errorMsg = errorMsg || $input.attr('error-msg') || '请检查';
            var role = $input.data("role");
            if(role){
                var widget = $input.data('widget');
                if(widget){
                    widget._showValidateMsg(errorMsg)
                }
            }
            else{
                $input.closest('.form-group').addClass('has-error');
                var _$helpBlock = $input.next();
                if(_$helpBlock.is('.help-block')){
                    _$helpBlock.text(errorMsg);
                }
                else{
                    _$helpBlock = $('<span class="help-block">' + errorMsg + '</span>');
                    $input.after(_$helpBlock);
                }
                _$helpBlock.show();
            }
        },

        _hideMessage:function($input){
            var role = $input.data("role");
            if(role){
                var widget = $input.data('widget');
                widget && typeof(widget._hideValidateMsg) == 'function' && widget._hideValidateMsg();
            }
            else{
                $input.closest('.form-group').removeClass('.has-error');
                var _$helpBlock = $input.next();
                if(_$helpBlock.is('.help-block')){
                    _$helpBlock.hide();
                }
            }
        },

        hideMessages:function(names){
            if(names){
                if(cri.isArray(names)){
                    for(var i = 0,len=names.length;i<len;i++){
                        this._hideMessage($('[name='+names[i]+']'));
                    }
                }
                else{
                    this._hideMessage($('[name='+names+']'));
                }
            }else{
                $(".input-warm",this.$element).hide();
            }
        }
    });

    cri.Validator = Validator;

    $.fn.validator = function(option) {
        var validator = null;
        this.each(function () {
            var $this   = $(this),
                options = typeof option == 'object' && option;
            validator = $this.data('validator');
            if(validator != null){
            }
            $this.data('validator', (validator = new Validator(this, options)));
        });
        return validator;
    };

}(window);

/**
 * Author zhouzy
 * Date   2014/10/14
 * window 组件
 *
 * 继承 Widgets
 *
 */
!function(window){

    "use strict";

    var cri = window.cri,
        $   = window.jQuery;

    var WINDOW_HEAD = "window-head";

    var icons = {Minimize:"fa fa-window-minimize",Maximize:"fa fa-window-maximize","Close":"fa fa-window-close-o","Resume":"fa fa-window-restore"},
        MINI_WINDOW_WIDTH = 140+10,
        WINDOW_BORDER = 1,
        ZINDEX = 10000;

    var _defaultOptions = {
        title:"",
        actions:["Close","Maximize"],//Colse:关闭,Minimize:最下化,Maximize:最大化
        content:null,
        isIframe:false,
        visible:false,
        modal:false,//模态窗口
        width:600,
        height:400,
        position:{top:0,left:0},
        center:true,//初始时是否居中
        resizable:true,
        dragable:true,

        onReady:null,//当窗口初始化完成时触发
        onOpen:null,//窗口打开时触发
        onClose:null,//窗口关闭时触发
        onMaximize:null,//窗口最大化时触发
        onMinimize:null,//窗口最小化时触发
        onResume:null//窗口复原时触发
    };

    var Window = cri.Widgets.extend(function(element,options){
        this.options = _defaultOptions;
        this.windowStatus = "normal";
        this.contentLoader = null;
        this.$elementPlaceHolder = null;//原始元素占位符
        cri.Widgets.apply(this,arguments);
        this.windowStack.push(this);
        this.toFront();
        this.$element.attr('data-role','window');
        if(!this.options.visible){
            this.$window.hide();
        }
    });

    $.extend(Window.prototype,{
        windowStack : [],//窗口栈
        mask:null,//遮罩

        _initOptions:function(options) {
            this.options = $.extend(true,{}, this.options, options);
            if(options.actions && options.actions.length){
                this.options.actions = options.actions;
            }
        },

        /**
         * 初始化组件监听事件
         * @private
         */
        _eventListen : function(){
            var that = this;
            if(this.options.dragable){
                this.$window.on("mousedown",".window-head",function(e){
                    var left     = +that._$panel.position().left,
                        top      = +that._$panel.position().top,
                        startX   = e.pageX,
                        startY   = e.pageY;
                    that.$window.addClass('will-change');
                    $(document).on("mousemove",function(e){
                        var pageX  = e.pageX,
                            pageY  = e.pageY;
                        left += (pageX - startX);
                        top  += (pageY - startY);
                        startX = pageX;
                        startY = pageY;
                        that._setPosition({top:top,left:left});
                    });
                })
            }

            this.$window
                .on("click",".action",function(){
                    var action = that._actionForButton($(this));
                    action && typeof that[action] === "function" && that[action]();
                    return false;
                })
                .on("click",".window-head",function(){
                    that.toFront();
                })
                .on("mousedown",".window-resizer",function(e){
                    var left     = +that._$panel.css("left").split("px")[0],
                        top      = +that._$panel.css("top").split("px")[0],
                        width    = +that._$panel.width(),
                        height   = +that._$panel.height(),
                        startX   = e.pageX,
                        startY   = e.pageY,
                        resizer  = /[ewsn]+$/.exec(this.className)[0];

                    $(document).on("mousemove",function(e){
                        var pageX  = e.pageX,
                            pageY  = e.pageY,
                            shiftX = pageX - startX,
                            shiftY = pageY - startY;
                        startX = pageX;
                        startY = pageY;
                        if(resizer.indexOf("e") >= 0){
                            width += shiftX;
                        }
                        if(resizer.indexOf("w") >= 0){
                            left = pageX;
                            width -= shiftX;
                        }
                        if(resizer.indexOf("n") >= 0){
                            top = pageY;
                            height -= shiftY;
                        }
                        if(resizer.indexOf("s") >= 0){
                            height += shiftY;
                        }
                        that._setPosition({top:top,left:left,width:width,height:height});
                    });
                });
            $(document).on("mouseup",function(){
                $(document).off("mousemove");
                that.$window.removeClass('will-change');
            });
        },

        /**
         * 初始化组件DOM结构
         * @private
         */
        _init : function(){
            var op = this.options;
            this._createWindow();
            op.resizable && this._createResizeHandler();
            this.$elementPlaceHolder.after(this.$window);
            op.visible ? this.$window.show() : this.$window.hide();
            this.$element.show();
        },

        /**
         * 包装window 内容部分
         * @private
         */
        _createWindow : function(){
            var op = this.options;
            var $window = this.$window = $('<div class="window"></div>');
            if(op.modal){
                $window.addClass('modal-window');
                this._$panel = $('<div class="panel panel-default"></div>');
                $window.append(this._$panel);
            }
            else{
                this._$panel = this.$window.addClass('panel panel-default');
            }
            if(op.center){
                var width = window.innerWidth;
                var height = window.innerHeight;
                this._setPosition({top:(height - op.height) / 2,left:(width - op.width)/2,width:op.width,height:op.height});
            }
            this._createWindowHead();
            this._createWindowBody();
            this.load(this.options.content);
        },

        /**
         * 生成window 头部
         * @private
         */
        _createWindowHead : function(){
            var $windowHead = $('<div class="' + WINDOW_HEAD + ' panel-heading"></div>');
            $windowHead.append(this._createTitle()).append(this._createActions());
            this._$panel.prepend($windowHead);
            this.$windowHead = $windowHead;
        },

        /**
         * 生成window内容区域
         * @private
         */
        _createWindowBody : function(){
            var that         = this,
                op           = this.options,
                $element     = this.$element,
                $windowBody  = $('<div class="window-content"></div>');
            var $placeHolder = this.$elementPlaceHolder = $('<div style="display:none"></div>');
            $element.after($placeHolder);
            $element.detach();
            this._setPosition({top:op.position.top,left:op.position.left,width:op.width,height:op.height});
            this._$panel.append($windowBody.append($element));
        },

        /**
         * 生成标题栏
         * @returns {*}
         * @private
         */
        _createTitle : function(){
            var title = this.options.title || "";
            return $("<span></span>").addClass("title").text(title);
        },

        /**
         * 根据actions 按照（最小化，放大，关闭）顺序生成按钮
         * 模态窗口不生成最小化按钮
         * @returns {*}
         * @private
         */
        _createActions : function(){
            var options = this.options,
                $buttons = $("<div></div>").addClass("actions"),
                defaultButtons = options.modal ? ["Maximize","Close"]:["Maximize","Close"];

            for(var i = 0, len = defaultButtons.length; i<len; i++){
                var defBtn = defaultButtons[i];
                for(var j = 0,l = options.actions.length; j < l; j++){
                    var action = options.actions[j];
                    if(action == defBtn){
                        var $button = $('<span class="action"></span>').addClass(action.toLowerCase()),
                            $icon   = $('<i class="' + icons[action] + '"></i>');
                        $buttons.append($button);
                        $button.append($icon);
                    }
                }
            }
            return $buttons;
        },

        /**
         * 生成 8个方位的 resizeHandler
         * @private
         */
        _createResizeHandler : function(){
            var resizerHandler = [],
                resizer = "n e s w nw ne se sw";
            $.each(resizer.split(" "),function(index,value){
                resizerHandler.push('<div class="window-resizer window-resizer-' + value + '" style="display: block;"></div>');
            });
            this._$panel.append(resizerHandler.join(""));
        },

        /**
         * 设置窗口位置
         * @param position {top:number,left:number,height:number,width:number}
         * @private
         */
        _setPosition : function(position){
            this._$panel.css(position);
            this.options.position = position;
        },

        /**
         * 根据icon类名返回对应的处理函数
         * @param icon
         * @returns {*}
         * @private
         */
        _actionForButton : function(button) {
            var iconClass = /\baction \w+\b/.exec(button[0].className)[0];
            return {
                "action minimize": "minimize",
                "action maximize": "maximize",
                "action resume": "resume",
                "action close": "close"
            }[iconClass];
        },

        /**
         * 根据窗口的状态设置窗口样式
         * @private
         */
        _setStyleByStatus : function(status){
            var op    = this.options,
                pos   = op.position,
                KLASS = {minimize:"mini-window",maximize:"maxi-window",closed:"",normal:""},
                style = {width:op.width,height:op.height,left:pos.left,top:pos.top,bottom:"auto",right:"auto"};
            this.$window.removeClass('mini-window').removeClass('maxi-window').addClass(KLASS[status]);
            this._$panel.css(style);
        },

        /**
         * 根据当前窗口状态设置窗口按钮组
         * @param buttons
         * @private
         */
        _setButtons : function(status){
            var BUTTONS = {minimize:["resume","close"],maximize:["resume","close"],normal:["minimize","maximize","close"]};
            var $actions = $(".actions",this.$window);
            $(".action",$actions).hide();

            if(status == "minimize"){
                var $btn = $(".maximize",$actions).removeClass("maximize").addClass("resume");
                $("i",$btn).prop("class",icons["Maximize"]);
            }

            if(status == "maximize"){
                var $btn = $(".maximize",$actions).removeClass("maximize").addClass("resume");
                $("i",$btn).prop("class",icons["Resume"]);
            }
            if(status == "normal"){
                var $btn = $(".resume",$actions).removeClass("resume").addClass("maximize");
                $("i",$btn).prop("class",icons["Maximize"]);
            }
            $.each(BUTTONS[status],function(index,value){
                $("." + value,$actions).show();
            });
        },

        /**
         * 当左侧最小化窗口复原后，右侧最小化窗口依次左移一个窗口位置
         * @param index
         * @private
         */
        _moveLeft : function(index){
            this.$window.css("left",MINI_WINDOW_WIDTH * index);
        },

        /**
         * 销毁自身
         * @private
         */
        _destroy : function(){
            var $element = this.$element.hide(),
                $wrapper = $element.parents(".window");
            var index = this.windowStack.indexOf(this);
            index>=0 && this.windowStack.splice(index,1);
            $wrapper.after($element);
            $wrapper.remove();
            $element.hide();
            $element.data("window",null);
        },

        /**
         * 由最小化打开窗口
         */
        open:function(){
            this._setStyleByStatus("normal");
            this.toFront();
            this.windowStatus = "normal";
            this.$window.show();
            this.options.onOpen && this.options.onOpen.call(this);
        },

        /**
         * 销毁当前窗口
         */
        close:function(){
            this.options.onClose && this.options.onClose.call(this);
            this.$window.hide();
        },

        /**
         * 最大化窗口
         * 最大化后 复原、关闭
         */
        maximize:function(){
            this._setStyleByStatus("maximize");
            this._setButtons("maximize");
            this.windowStatus = "maximize";
            this.$window.removeClass('center');
            this.options.onMaxmize && this.options.onMaxmize.call(this);
        },

        /**
         * 最小化窗口
         * 依次排放到左下侧
         * 模态窗口没有最小化按钮
         */
        minimize : function(){
            this._setButtons("minimize");
            $(".window-content",this.$window).hide();
            var left = $(".mini-window").size() * MINI_WINDOW_WIDTH;
            this._setStyleByStatus("minimize");
            this.$window.css("left",left);
            this.windowStatus = "minimize";
            this.options.onMinimize && this.options.onMinimize.call(this);
        },

        /**
         * 复原窗口到初始(缩放、移动窗口会改变初始位置尺寸信息)尺寸、位置
         */
        resume : function(){
            this._setButtons("normal");
            this._setStyleByStatus("normal");
            $(".window-content",this.$window).show();
            if(this.windowStatus == "minimize"){
                var i = 0;
                this.windowStatus = "normal";
                $.each(Window.prototype.windowStack,function(index,wnd){
                    if(wnd.windowStatus == "minimize"){
                        wnd._moveLeft(i++);
                    }
                });
            }
            if(this.options.center){
                this.$window.addClass('center');
            }
            this.windowStatus = "normal";
            this.options.onResume && this.options.onResume.call(this);
        },


        /**
         * 把当前窗口顶至最前
         */
        toFront:function(){
            var stack = this.windowStack;
            var index = stack.indexOf(this);
            stack.splice(index,1);
            stack.push(this);
            var len = stack.length;
            for(var i=len-1;i>=0;i--){
                if(stack[i].options.modal){
                    for(var j=0;j<len;j++){
                        j<i?stack[j].$window.css('zIndex',ZINDEX+j):
                            stack[j].$window.css('zIndex',ZINDEX+j+1);
                    }
                    break;
                }
                else{
                    stack[i].$window.css('zIndex',ZINDEX+i);
                }
            }
        },

        load:function(content){
            var $element = this.$element,
                that = this,
                op = this.options,
                $loadingIcon = $('<i class="fa fa-spinner fa-spin"></i>').addClass("loadingIcon");
            if(content){
                $element.empty();
                $element.addClass("loading").html($loadingIcon);
                this.contentLoader = new cri.ContentLoader($element,{
                    content:content,
                    isIframe:op.isIframe,
                    onReady:function(){
                        $element.removeClass("loading");
                        $loadingIcon.remove();
                        op.onReady && op.onReady.call(that,that.$window);
                    }
                });
            }else{
                op.onReady && op.onReady.call(that,that.$window);
            }
        }
    });

    cri.Window = Window;

    $.fn.window = function(option) {
        var o = null;
        this.each(function () {
            var $this   = $(this),
                wnd     = $this.data('window'),
                options = typeof option == 'object' && option;
            if(wnd != null) {
                wnd.close();
            }
            $this.data('window', (o = new Window(this, options)));
        });
        var nowDiv = o.$window;
        nowDiv.mouseout(function(){
            if(nowDiv.offset().top < 0){
                nowDiv.css("top", 0);
            }
        });
        return o;
    };
}(window);
