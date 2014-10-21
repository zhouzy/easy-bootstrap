/**
 * Author zhouzy
 * Date   2014/9/18
 * grid 组件
 *
 */
!function(window){

    "use strict";

    var cri = window.cri,
        $   = window.jQuery;

    /**
     * 定义表格标题，工具栏，分页高度
     */
    var _titleH       = 31, //标题高度
        _toolbarH     = 31, //工具栏高度
        _pagerH       = 41, //分页高度
        _gridHeadH    = 31, //表格头高度
        _cellMinW     = 5;  //单元格最小宽度

    /**
     * 计算表格高度
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
                calHeight = Math.floor($ele.parent().width() * arr[0] / 100);
            }
            calHeight = calHeight.split("px")[0];
            if(calHeight){
                return parseInt(calHeight);
            }
        }
        else{
            return null;
        }
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
            var fieldArr = "[";
            $("tr th,td", $table).each(function(){
                var data  = $(this).data("options"),
                    title = $(this).html();
                if(data){
                    fieldArr += "{title:\'" + title + "\'," + data + "},";
                }
                else{
                    fieldArr  += "{title:\'" + title + "\'},";
                }
            });
            fieldArr += "]";
            fieldArr = fieldArr.replace(/\},\]/g, "}]").replace(/\],\]/g, "]]");

            return (new Function("return " + fieldArr))();
        }());

        columns.map(function(column){
            if(column.field && column.width){
                column._width = column.width;
            }
            return column;
        });

        return columns;
    }

    /**
     * 表格默认属性
     * @type {{url: null, param: {}, title: null, toolbar: null, columns: null, rows: null, async: boolean, onClick: null, onDblClick: null, rowNum: boolean, checkBox: boolean, onChecked: null, changeRowCheck: null, pagination: boolean, page: number, pageSize: number, total: number, ajaxDone: null, ajaxError: null}}
     * @private
     */
    var _defaultOptions = {
        url:null,
        param:{},
        title:null,
        toolbar:null,
        columns:null,
        rows:null,
        async:false,
        onClick:null,
        onDblClick:null,
        rowNum:true,
        checkBox:false,
        onChecked:null,//每行checkbox被选中时触发回调函数,当该回调函数返回,参数row,rowid
        changeRowCheck:null,//使某行checkbox为选中或不选中,参数 rowid, isChecked
        pagination:true,
        page:1,
        pageSize:10,
        total:0,
        ajaxDone:null,
        ajaxError:null
    };

    var Grid = cri.Widgets.extend(function(element,options){
        this.options     = _defaultOptions;
        this.$element    = $(element);
        this.$grid       = null;
        this.$gridhead   = null;
        this.$gridbody   = null;
        this.$toolbar    = null;
        this.$page       = null;
        this.$title      = null;
        this._columns    = [];
        this.selectedRow = null;
        this._gridClassName = this._gridClassName || "datagrid";
        cri.Widgets.apply(this,arguments);
    });

    $.extend(Grid.prototype,{
        _eventListen:function(){
            var that = this;
            var op = this.options;
            var dragStartX = 0;

            this.$gridbody
                .on("scroll",function(e){
                    $(".grid-head-wrap",that.$gridhead).scrollLeft($(this).scrollLeft());
                })
                .on('click', "tr", function(e){
                    that.setSelected(e);
                })
                .on('dblclick', "tr", function(e){
                    that.onDblClickRow(e);
                })
                .on("change", "input[type=checkbox]",function(e){
                    var isChecked = $(e.target).prop("checked");
                    var rowid = $(e.target).closest("tr").data("rowid");
                    if(isChecked && op.onChecked){
                        op.onChecked(that.getRowDataById(rowid),rowid);
                    }
                });

            $("body").on("mouseup",function(e){
                that.$gridhead.css("cursor","");
                that.$gridhead.off("mousemove");
            });
            this.$gridhead
                .on('mousedown',".drag-line",function(e){
                    var dragLineIndex = 0;
                    op.rowNum && dragLineIndex++;
                    op.checkBox && dragLineIndex++;

                    dragLineIndex += $(this).data("drag");

                    var $col = $("col:eq("+ dragLineIndex +")",that.$gridhead);
                    that.$gridhead.css("cursor","e-resize");
                    dragStartX = e.pageX;

                    that.$gridhead.on("mousemove",function(e){
                        var px = e.pageX - dragStartX;
                        var width = $col.width() + px;
                        var tableWidth = $("table",that.$gridhead).width();

                        dragStartX = e.pageX;

                        if(width >= _cellMinW){
                            $("table",that.$gridbody).width(tableWidth + px);
                            $("table",that.$gridhead).width(tableWidth + px);
                            $col.width(width);
                            $("col:eq("+ dragLineIndex +")",that.$gridbody).width(width);
                        }
                    });

                })
                .on('click',"input[type=checkbox]",function(e){
                    var isChecked = $(e.target).prop("checked");
                    $("input[type=checkbox]",that.$gridbody).each(function(){
                        $(this).prop("checked",isChecked);
                    });
                    if(isChecked && op.onChecked){
                        for(var i=0;i<op.rows.length;i++){
                            op.onChecked(op.rows[i],i);
                        }
                    }
                });

            this.$toolbar && this.$toolbar
                .on('click',"li[data-toolbar]",function(e){that.clickToolbar(e);});

            this.$page && this.$page
                .on('click',"a[data-page]",function(e){
                    op.page = $(e.target).closest("a").data('page');
                    that.page();
                })
                .on('click','input.renovate',function(e){
                    var pagesize = $("input[name=pagesize]",that.$page).val();
                    var pagenum = $("input[name=pagenum]",that.$page).val();
                    op.page = pagenum;
                    op.pageSize = pagesize;
                    that.page();
                });
        },

        _init:function () {
            this._columns = _getColumnsDef(this.$element,this.options.columns);
            this._getData();
            this._createGrid();
        },

        _createGrid:function(){
            var height = _getElementHeight(this.$element,this.options.height);
            var $grid = $("<div></div>").addClass(this._gridClassName).css("height",height);
            $grid.attr("style",this.$element.attr("style")).show();
            this.$element.wrap($grid);
            this.$element.hide();

            this.$grid = this.$element.parent();
            this._createTitle(this.$grid);
            this._createToolbar(this.$grid);
            this._createGridView(this.$grid,height);
            this._createPage(this.$grid);
        },

        _createGridView:function($parent,height){
            this.$gridview = $("<div></div>").addClass("grid-view");
            this.$gridbody = $("<div></div>").addClass("grid-body");
            this.$gridhead = $("<div></div>").addClass("grid-head");
            $parent.append(this.$gridview.append(this.$gridhead).append(this.$gridbody));

            if(height){
                height -= _gridHeadH;
                this.options.title      && (height -= _titleH);
                this.options.toolbar    && (height -= _toolbarH);
                this.options.pagination && (height -= _pagerH);
                this.$gridbody.css("height",height);
            }

            this._createBody(this.$gridbody);
            this._createHead(this.$gridhead);
        },

        _createTitle:function($grid){
            if(this.options.title){
                this.$title = $('<div class="title"><span>' + this.options.title + '</span></div>');
                $grid.append(this.$title);
            }
        },

        _createHead:function($parent){
            var $headWrap = $("<div></div>").addClass("grid-head-wrap"),
                $table    = $("<table></table>"),
                $tr       = $("<tr></tr>"),
                op        = this.options,
                columns   = this._columns;

            $table.append($("colgroup",this.$gridbody).clone());
            $table.append($tr);

            if(op.checkBox){
                var $lineCheckbox = $("<td></td>").addClass("line-checkbox").append('<span class="td-content"><input type="checkbox"/></span>');
                $tr.append($lineCheckbox);
            }
            if(op.rowNum){
                var $lineNumber = $("<td></td>").addClass("line-number").append('<div class="td-content"></div>');
                $tr.append($lineNumber);
            }

            for(var i = 0,len = columns.length; i<len; i++){
                var $td        = $('<td></td>'),
                    $dragLine  = $('<div></div>').addClass('drag-line').data('drag',i),
                    $tdContent = $('<div></div>').addClass('td-content grid-header-text'),
                    column     = columns[i];
                for(var key in column){
                    var value = column[key];
                    if(key == 'title'){
                        $tdContent.prop('title',value).append(value);
                    }
                    else if(key !== 'field' && key !== 'width'){
                        $td.css(key,value);
                    }
                }
                $td.append($tdContent);
                i < (len - 1) && $td.append($dragLine);
                $tr.append($td);
            }
            $parent.html($headWrap.html($table));
        },

        _createBody:function($parent){
            var $table   = $('<table></table>'),
                op       = this.options,
                id       = 0,
                lineNum  = 1 + op.pageSize * (op.page - 1),
                columns  = this._columns;

            $table.append(this._createColGroup());

            for(var i = 0,len = op.rows.length; i<len; i++){
                var row = op.rows[i];
                var $tr  = $('<tr></tr>').data("rowid",id);

                if(op.checkBox){
                    $tr.append($("<td></td>").addClass("line-checkbox").append('<input type="checkbox"/>'));
                }
                if(op.rowNum){
                    $tr.append($("<td></td>").addClass("line-number").append(lineNum));
                }

                for(var j = 0,length = columns.length; j<length;j++){
                    var $td = $('<td></td>');
                    var $content = $('<div></div>').addClass('td-content');
                    var column = columns[j],
                        text   = row[column.field] || "",
                        _text  = ("" + text).replace(/<.\w+\s*[^<]+>/g,"");
                    $content.prop("title",_text).text(_text);
                    $td.append(_text);
                    $tr.append($td);
                }
                lineNum++;id++;
                $table.append($tr);
            }

            $parent.html($table);
        },

        _createColGroup:function(){
            var $colgroup= $("<colgroup></colgroup>"),
                op       = this.options,
                columns  = this._columns;
            op.checkBox && $colgroup.append($("<col/>").width(30));
            op.rowNum   && $colgroup.append($("<col/>").width(25));

            for(var i= 0,len=columns.length; i<len;i++){
                var $col = $("<col/>");
                columns[i]._width && $col.width(columns[i]._width);
                $colgroup.append($col);
            }
            return $colgroup;
        },
        _createToolbar:function($parent){
            if(this.options.toolbar){
                var $toolbar = $('<div class="toolbar"></div>');
                var html = "<ul>"
                $.each(this.options.toolbar,function(index,data){
                    html += "<li data-toolbar=\"" + index + "\">" + this.text + "</li>";
                });
                html += "</ul>";
                $toolbar.append(html);
                $parent.append($toolbar);
                this.$toolbar = this.$toolbar || $toolbar;
            }
        },

        _createPage:function($parent){
            if(this.options.pagination){
                var op        = this.options,
                    pageSize  = op.pageSize || 10,
                    total     = op.total || 0,
                    page      = parseInt(op.page) || 1,
                    totalPage = Math.ceil(total / pageSize),
                    lastPage  = page - 1,
                    nextPage  = page + 1;

                var $pagerNav   = $("<div></div>").addClass("pager-nav"),
                    $firstPage  = $("<a></a>").append('<span class="fa fa-angle-double-left"></span>'),
                    $lastPage   = $("<a></a>").append('<span class="fa fa-angle-left"></span>'),
                    $nextPage   = $("<a></a>").append('<span class="fa fa-angle-right"></span>'),
                    $totalPage  = $("<a></a>").append('<span class="fa fa-angle-double-right"></span>'),
                    $numberPage = $("<ul></ul>").addClass("pager-number"),
                    $pageInfo   = $("<div></div>").addClass("pager-info").text(((page-1) * pageSize + 1) + ' - ' + (page * pageSize) + ' of ' + total + ' items');

                if(page <= 1){
                    $firstPage.addClass("state-disabled");
                    $lastPage.addClass("state-disabled");
                }
                else{
                    $firstPage.data("page",1);
                    $lastPage.data("page",lastPage);
                }

                for(var i=-2; i<3; i++){
                    var shiftPage = i + page;
                    if(shiftPage>0 && shiftPage<=totalPage){
                        var $li = $("<li></li>"),
                            $a  = $("<a></a>").text(shiftPage);
                        shiftPage != page ?
                            $a.addClass("pager-num"):
                            $a.addClass("state-selected");
                        $numberPage.append($li.append($a));                    }
                }

                $pagerNav.append($firstPage).append($lastPage).append($numberPage).append($nextPage).append($totalPage);

                if(page >= totalPage){
                    $nextPage.addClass("state-disabled");
                    $totalPage.addClass("state-disabled");
                }else{
                    $nextPage.data("page",nextPage);
                    $totalPage.data("page",totalPage);
                }

                if(this.$page){
                    this.$page.html($pagerNav);
                    this.$page.append($pageInfo);
                }
                else{
                    var $pager = this.$page = $("<div></div>").addClass("pager");
                    $pager.html($pagerNav);
                    $pager.append($pageInfo);
                    $parent.append($pager);
                }
            }
        },

        _refreshPage:function(){
            if(this.$page){
                var op        = this.options,
                    pageSize  = op.pageSize || 10,
                    total     = op.total || 0,
                    page      = parseInt(op.page) || 1,
                    totalPage = Math.ceil(total / pageSize),
                    lastPage  = page - 1,
                    nextPage  = page + 1;

                var $pagerNav  = $("<div></div>").addClass("pager-nav"),
                    $firstPage = $("<a></a>").addClass("pager-nav first-page").append('<span class="fa fa-angle-double-left"></span>'),
                    $lastPage  = $("<a></a>").addClass("pager-nav last-page").append('<span class="fa fa-angle-left"></span>'),
                    $nextPage  = $("<a></a>").addClass("pager-nav next-page").append('<span class="fa fa-angle-right"></span>'),
                    $totalPage = $("<a></a>").addClass("pager-nav totalPage").append('<span class="fa fa-angle-double-right"></span>'),
                    $pageInfo  = $("<div></div>").addClass("pager-info").text(((page-1) * pageSize + 1) + ' - ' + (page * pageSize) + ' of ' + total + ' items');

                $pagerNav.append($firstPage).append($lastPage);
                if(page <= 1){
                    $firstPage.addClass("state-disabled").data("page",null);
                    $lastPage.addClass("state-disabled").data("page",null);
                }
                else{
                    $firstPage.removeClass("state-disabled").data("page",1);
                    $lastPage.removeClass("state-disabled").data("page",lastPage);
                }
                if(page >= totalPage){
                    $nextPage.addClass("state-disabled").data("page",null);
                    $totalPage.addClass("state-disabled").data("page",null);
                }
                else{
                    $nextPage.removeClass("state-disabled").data("page",nextPage);
                    $totalPage.removeClass("state-disabled").data("page",totalPage);
                }

                for(var i=-2; i<3; i++){
                    var shiftPage = i + page;
                    if(shiftPage>0 && shiftPage<=totalPage){
                        var $numPage = $("<a>").addClass("pager-nav").text(shiftPage);
                        shiftPage != page ?
                            $numPage.addClass("pager-num"):
                            $numPage.addClass("state-selected");
                        $pagerNav.append($numPage);                    }
                }
            }
        },

        _getData:function(){
            var result = true,
                op = this.options;
            if(op.pagination){
                op.param.page = op.page;
                op.param.rows = op.pageSize;
            }
            $.ajax({
                type: "post",
                url: this.options.url,
                success: function(data){
                    if(op.ajaxDone){
                        op.ajaxDone(data);
                    }
                    op.rows = data.rows || [];
                    op.total = data.total || 0;
                },
                error: function(){
                    //TODO: warming developer
                    op.rows = [];
                    op.total = 0;
                },
                complete:function(){
                    //TODO:clear all resource if necessary
                },
                data:op.param,
                dataType:"JSON",
                async:false
            });
            return result;
        },

        _page:function(){
            this._getData();
            this.refreshGridView();
            this._createPage(this.$page);
        },

        refreshGridView:function(){
            this._createBody(this.$gridbody);
            this._createHead(this.$gridhead);
            this._createPage(this.$page);
        },

        reload:function(param){
            param && (this.options.param = param);
            this.selectedRow = null;
            this._getData();
            this.refreshGridView();
        },

        loadData:function(param){
            if(param.push){
                this.options.rows = param;
                this.refreshGridView();
            }
        },

        getMulSelected:function(){
            var mulSelectRow = [],
                that = this;
            $("tr[data-rowid] input[type='checkbox']:checked",this.$gridbody).each(function(){
                var rowid = $(this).closest("tr").data("rowid");
                mulSelectRow.push(that.getRowDataById(rowid));
            });
            return mulSelectRow;
        },

        getSelected:function(){
            return this.selectedRow;
        },

        setSelected:function(e){
            var item = $(e.target).closest("tr")
                ,rowid = item.data('rowid');
            $("tr",this.$gridbody).toggleClass("click",false);
            this.selectedRow = this.getRowDataById(rowid);
            item.toggleClass("click");
            if(this.options.onClick){
                this.options.onClick(this.selectedRow);
            }
        },

        getRowDataById:function(rowid){
            return this.options.rows[parseInt(rowid)];
        },

        onDblClickRow:function(e){
            var op = this.options
                ,item = $(e.target).closest("tr")
                ,rowid = item.data('rowid')
                ,that = this;
            this.selectedRow = this.getRowDataById(rowid);
            if(op.onDblClick){
                op.onDblClick(that.selectedRow);
            }
        },

        clickToolbar:function(e){
            var toolbar = $(e.target)
                ,index = toolbar.data('toolbar');
            this.options.toolbar[index].handler();
        },

        changeRowCheck:function(rowid,isChecked){
            this.options.checkBox &&
            $("tr:eq("+rowid+") input[type=checkbox]",this.$gridbody).prop("checked",isChecked);
        }
    });

    cri.Grid = Grid;
}(window);