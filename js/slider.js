(function(window){
	'use strict';
	//初始函數: 把所有的程式碼都包在init裡面，方便在之後的DOMContentLoaded 函數裡一次呼叫
	function init() {
		//取得json檔案
		var request = new XMLHttpRequest(),data,fargment,div,a,img,content,h2,p,title,subTitle,i,max;
			request.open('GET', 'data.json', true);
			
		request.onload = function() {
			//如果http狀態碼小於400(沒有發生錯誤),則開始抓取json資料
			  if (request.status >= 200 && request.status < 400) {
			    	data = JSON.parse(request.responseText),
			    	fargment = document.createDocumentFragment();
					//使用document.createDocumentFragment()避免不斷更新html,增加效能
			        for (i = 0, max = data.length; i < max; i++) {
			        	
			        	div = document.createElement('div');
			        	a = document.createElement('a');
			        	img = document.createElement('img');
			        	content = document.createElement('div');
			        	h2 = document.createElement('h2');
			        	p = document.createElement('p');
			        	title = document.createTextNode(data[i][2]);
			        	subTitle = document.createTextNode(data[i][3]);

						//從json檔裡撈取資料,建構slider所需html
			        	img.setAttribute('src',data[i][0]);
			        	a.setAttribute('href',data[i][1]);
			        	content.setAttribute('class','content');
			        	h2.appendChild(title);
			        	p.appendChild(subTitle);
			        	content.appendChild(h2);
						content.appendChild(p);
						a.appendChild(content);
						a.appendChild(img);
						div.appendChild(a);
						div.setAttribute('class','pages');
						fargment.appendChild(div);
			        }

			        document.querySelector('#ADB2').appendChild(fargment);

			        //html架構完成後,執行slider函數讓slider可以運作
			        slider();
				
			  } else {
			    alert('We reached our target server, but it returned an error');
			  }
			};

			request.onerror = function() {
			  alert('There was a connection error of some sort');
			};

			request.send();

		function slider() {

			          var pages = document.querySelectorAll('.pages'),
			          pagesImg = document.querySelectorAll('.pages img'),
			          anncPrev = document.querySelector('.prev'),
			          adb = document.querySelector('#ADB2'), 
			          anncNext = document.querySelector('.next'),
			          allElem = document.querySelectorAll('#ADB *'),
			          pnF = document.createElement('ul'),
			          pnWrap = document.createElement('div'),
			          width = window.innerWidth,
			          state = 'stop',
			          ads,
			          aindex = 0,
			          nowIndex,
			          preIndex,
			          TT,
			          time,
			          i,
			          max;
		          
					  pages[0].classList.add('active');
						pnF.setAttribute('class','pagination');

						//製作導覽列,使用cloneNode將banner的圖片複製到導覽列
						for(i=0,max=pages.length;i<max;i++){
							var pn = document.createElement('li'),
								pnC = document.createElement('a'),
								cloneImg = document.querySelectorAll('.pages img')[i].cloneNode(true);
							pagesImg[i].setAttribute('class','pages-img');							
							cloneImg.setAttribute('width','135');
							cloneImg.setAttribute('height','58');
							cloneImg.setAttribute('class','banner-img');
							pnC.setAttribute('href','javascript:;');
							pnC.setAttribute('class','paginations');
							pnC.appendChild(cloneImg);
							pn.appendChild(pnC);
							pnF.appendChild(pn);
						}


						adb.parentNode.appendChild(pnF);

						allElem = document.querySelectorAll('#ADB *');
			            //給每個dom元素一個屬性,之後用來做mouseenter效果
		                for(i=0,max=allElem.length; i<max; i++){
		                  allElem[i].area = 'banner';
		                } 	

						var pagination = document.querySelectorAll('.pagination > li'),
							paginationF = document.querySelector('.pagination');			
						pagination[0].classList.add('active');

						for(i=0,max=pagination.length;i<max;i++){

							//以下為導覽列點擊功能
							pagination[i].onclick = function(){

								//用state變數判斷slider是否正在運行,如果正在運行則state為run,不會再繼續進行動作
								if(state==='run'){
									return;
								}else{
									state = 'run';
									var paginationA = document.querySelector('.pagination > li.active');
									//用getIndex函數(類似於jquery的index())取得現在點擊的idnex和現在class為active的index
									nowIndex = getIndex(this);							
									preIndex = getIndex(paginationA);

									//如果現在點擊的idnex較小,則圖片由左至右進入
							        if(nowIndex < preIndex) {
										aindex = nowIndex;
										pagination[aindex].classList.add('active');

										//新增由左至右進入的class
								        pages[aindex].classList.add('ltr_in');
								        pages[aindex].classList.remove('ltr_out');
								        pages[aindex].classList.remove('rtl_out');	
								        pages[preIndex].classList.add('ltr_out');
								        pages[preIndex].classList.remove('ltr_in');	
								        pages[preIndex].classList.remove('rtl_in');

								        //用	getSiblings函數(類似於jquery的siblings())來取得其他dom元素,並移除class
							            getSiblings(pages[aindex],pages[preIndex]);	
							            getSiblings(pagination[aindex]);	
							        }else if(nowIndex > preIndex) {
							        	//如果現在點擊的idnex較大,則圖片由右至左進入

										aindex = nowIndex;
										pagination[aindex].classList.add('active');

										//新增由右至左進入的class
								        pages[aindex].classList.add('rtl_in');
								        pages[aindex].classList.remove('rtl_out');
								        pages[aindex].classList.remove('ltr_out');	
								        pages[preIndex].classList.add('rtl_out');
								        pages[preIndex].classList.remove('rtl_in');	
								        pages[preIndex].classList.remove('ltr_in');	

								        //用	getSiblings函數(類似於jquery的siblings())來取得其他dom元素,並移除class
							            getSiblings(pages[aindex],pages[preIndex]);
							            getSiblings(pagination[aindex]);								        	
							        }	
			                     setTimeout(function(){
			                        state = 'stop';
			                        //動畫完成之後,state為stop,便可進行點擊
			                      },500);								        								
								}

 		
							}
						}

					//prev點擊功能				          
					  function adPrev(){
						if(state==='run'){
							return;
						}else{
						  state='run';
				          pages[0].classList.remove('active');

				          //用迴圈去除多餘的class
				          for(i=0,max=pages.length;i<max;i++){
				              pages[i].classList.remove('rtl_in');
				              pages[i].classList.remove('rtl_out');              
				          }

						  	//判斷是否為最後一張,如果為第一張則跳到最後一張,否則照片依序遞減	
							if(aindex <= 0){
								aindex=pages.length-1;
								pagination[aindex].classList.add('active');
				            	pages[pages.length-1].classList.add('ltr_in');
				            	pages[pages.length-1].classList.remove('ltr_out');
				            	pages[0].classList.add('ltr_out');  
				            	pages[0].classList.remove('ltr_in'); 
				            	getSiblings(pages[0],pages[pages.length-1]);	
				            	getSiblings(pagination[aindex]);							
							}
							else{

				          		aindex--;
				          		pagination[aindex].classList.add('active');
					            pages[aindex].classList.add('ltr_in');
					            pages[aindex].classList.remove('ltr_out');
					            pages[aindex+1].classList.add('ltr_out');
					            pages[aindex+1].classList.remove('ltr_in');	
				            	getSiblings(pages[aindex],pages[aindex+1]);	
				            	getSiblings(pagination[aindex]);
							}
	                      setTimeout(function(){
	                        state = 'stop';
	                      },500);					  					
						}

					  }


					function adNext(){

						if(state==='run'){
							return;
						}else{
							state='run'
					        pages[0].classList.remove('active');
				            for(i=0,max=pages.length;i<max;i++){
				              pages[i].classList.remove('ltr_in');
				              pages[i].classList.remove('ltr_out');              
				            }      
				            	//判斷是否為最後一張,如果為最後一張則跳到第一張,否則照片依序遞增	
								if(aindex >= (pages.length-1)){
					          		aindex=0;
					          		pagination[aindex].classList.add('active');
					              	pages[aindex].classList.add('rtl_in');
					              	pages[aindex].classList.remove('rtl_out');
					              	pages[pages.length-1].classList.add('rtl_out');  
					              	pages[pages.length-1].classList.remove('rtl_in'); 			              	
					          		getSiblings(pages[aindex],pages[pages.length-1]);						
					          		getSiblings(pagination[aindex]);		
								}else{
									aindex++;
									pagination[aindex].classList.add('active');
				              		pages[aindex].classList.add('rtl_in');
				              		pages[aindex].classList.remove('rtl_out');	
				              		pages[aindex-1].classList.add('rtl_out');
				              		pages[aindex-1].classList.remove('rtl_in');
									getSiblings(pages[aindex],pages[aindex-1]);
									getSiblings(pagination[aindex]);			
								}

				            }
		                      setTimeout(function(){
		                        state = 'stop';
		                      },500);

					}
	

		      	  if(pages.length<=1 ){
		      	  	return;
		      	  }
		      	  else{

	
				      anncPrev.onclick = function(){
				      	adPrev();
				      };
				      anncNext.onclick = function(){
						adNext();
				      }

			      		TT = setInterval(adNext,5000);  
			          time = 'on';
			          document.body.onmouseover = function(e){
			          	//滑鼠滑入暫停輪播效果,並用變數time的'on'或'off'來避免重複觸發clearInterval事件
			            if(e.target.area !=='banner' && time === 'on'){
			                return;

			            }else if(e.target.area ==='banner' && time === 'on'){

			              clearInterval(TT);
			              time='off';

			            }else if(e.target.area !=='banner' && time === 'off'){
			                TT = setInterval(adNext,5000);
			                time='on';

			            }

			          }  

					  							
		      	   }			
		              function getChildren(n, skipMe1,skipMe2,hide){
		                  var r = [];
		                if(typeof hide !=='function'){
		                  hide = false;
		                }
		                  for (i =0,max=n.length; i<max; i++) {

		                     if (n[i] !== skipMe1 && n[i] !== skipMe2)
		                     {
		                       if(hide){
		                      	hide(n[i]);//使用callback的方式呼叫getSiblings裡的hide函數,可避免再多跑一次迴圈
		                       }     
		                     }
		                  }
		              };

		              function getSiblings(n1,n2) {
		              	//取得dom元素的鄰居
		                  var hide = function(sib){                                   
		                            sib.classList.remove('rtl_in');
		                            sib.classList.remove('rtl_out');
		                            sib.classList.remove('ltr_in'); 
		                            sib.classList.remove('ltr_out'); 
		                            sib.classList.remove('active'); 
		                  } 
		                  getChildren(n1.parentNode.children, n1,n2,hide);
		              }
			          function getIndex(node){
			          	//取得dom元素的索引值
	                      var children = node.parentNode.childNodes;
	                      var num = 0;
	                      for (i=0,max=children.length; i<max; i++) {
	                                 if (children[i]==node) return num;
	                                 if (children[i].nodeType==1) num++;
	                      }
	                      return -1;
			          }


		}		
	}

	document.addEventListener('DOMContentLoaded',function() {
		init();
	})	
	
})(window)

