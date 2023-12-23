(()=>{"use strict";const t=()=>{const t=["A","B","C","D","E","F","G","H","I","J"],e=["1","2","3","4","5","6","7","8","9","10"],a=[],r=(r,s)=>{const n=t.indexOf(r),i=e.indexOf(s);return-1===n||-1===i?null:a[i][n]},s=(r,s,n,i)=>{const o=t.indexOf(r),l=e.indexOf(s);return-1===o||-1===l?null:(a[l][o].status=n,i&&(a[l][o].takenBy=i),a[l][o])};return(()=>{for(let r=0;r<10;r+=1){a[r]=[];for(let s=0;s<10;s+=1)a[r][s]={col:t[s],row:e[r],status:"empty",takenBy:void 0}}})(),{getCell:r,placeShip:(a,n,i,o)=>{const l="horizontal"===o,c=l?t:e,d=c.indexOf(l?n:i);if(d<0||d+a.size>c.length)return!1;for(let t=0;t<a.size;t+=1){const e=l?c[d+t]:n,o=l?i:c[d+t];if("empty"!==r(e,o).status)return!1;s(e,o,"taken",a)}return!0},receiveAttack:(t,e)=>{const a=r(t,e);return"taken"===a.status?(a.takenBy.hit(),s(t,e,"hit"),a.status):"empty"===a.status?(s(t,e,"miss"),a.status):null},allSunk:()=>{for(let t=0;t<10;t+=1)for(let e=0;e<10;e+=1)if("taken"===a[t][e].status&&!a[t][e].takenBy.isSunk())return!1;return!0},array:a}},e=t=>{let e,a=0;"Carrier"===t&&(e=5),"Battleship"===t&&(e=4),"Destroyer"===t&&(e=3),"Submarine"===t&&(e=3),"Patrol Boat"===t&&(e=2);return{name:t,size:e,hit:()=>{a+=1},isSunk:()=>a===e}},a=()=>({attack:(t,e,a)=>"hit"!==t.getCell(e,a).status&&"miss"!==t.getCell(e,a).status?t.receiveAttack(e,a):"already shot",randomAttack:t=>{const e=["A","B","C","D","E","F","G","H","I","J"];let a,r;do{a=e[Math.floor(Math.random()*e.length)],r=Math.ceil(10*Math.random()).toString()}while("hit"===t.getCell(a,r).status||"miss"===t.getCell(a,r).status);return"hit"!==t.getCell(a,r).status&&"miss"!==t.getCell(a,r).status?t.receiveAttack(a,r):"already shot"}}),r=t(),s=t(),n=a(),i=a();(()=>{const t=e("Carrier"),a=e("Battleship"),n=e("Destroyer"),i=e("Submarine"),o=e("Patrol Boat");r.placeShip(t,"A","1","horizontal"),r.placeShip(a,"A","3","horizontal"),r.placeShip(n,"A","5","horizontal"),r.placeShip(i,"A","7","horizontal"),r.placeShip(o,"A","9","horizontal"),s.placeShip(t,"A","1","vertical"),s.placeShip(a,"C","1","vertical"),s.placeShip(n,"E","1","vertical"),s.placeShip(i,"G","1","vertical"),s.placeShip(o,"I","1","vertical")})();const o=()=>{const t=document.createElement("div");t.id="wrapper",document.body.append(t);const e=(t,e)=>{t.array.forEach((t=>{t.forEach((t=>{const a=(t=>{const e=document.createElement("div");return e.classList.add("cell"),e.classList.add(t.status),e.setAttribute("data-col",t.col),e.setAttribute("data-row",t.row),e})(t);e.append(a)}))}))},a=a=>{const n=document.createElement("div");n.classList.add("board"),a===r?n.id="firstBoard":a===s&&(n.id="secondBoard"),e(a,n),t.append(n)},o=t=>{const a=t===r?"firstBoard":"secondBoard",s=document.querySelector(`#${a}`);s.innerHTML="",e(t,s)};a(r),a(s),document.querySelector("#secondBoard").addEventListener("click",(t=>{if(!t.target.classList.contains("hit")&&!t.target.classList.contains("miss")){const e=t.target.getAttribute("data-col"),a=t.target.getAttribute("data-row");n.attack(s,e,a),o(s),i.randomAttack(r),o(r)}}))};o()})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFpQixhQUFlLGNBQ3hEa0IsRUFBUU4sU0FBU2UsY0FBYyxJQUFJRCxLQUN6Q1IsRUFBTVUsVUFBWSxHQUNsQlgsRUFBWTFCLEVBQVcyQixFQUFNLEVBZ0NqQ00sRUFBWXhCLEdBQ1p3QixFQUFZdkIsR0E5QllXLFNBQVNlLGNBQWMsZ0JBQy9CRSxpQkFBaUIsU0FBVUMsSUFDbkMsSUFBS0EsRUFBRUMsT0FBT1gsVUFBVVksU0FBUyxTQUFXRixFQUFFQyxPQUFPWCxVQUFVWSxTQUFTLFFBQVMsQ0FDN0UsTUFBTXpFLEVBQU11RSxFQUFFQyxPQUFPRSxhQUFhLFlBQzVCekUsRUFBTXNFLEVBQUVDLE9BQU9FLGFBQWEsWUFDbEMvQixFQUFNWixPQUFPVyxFQUFtQjFDLEVBQUtDLEdBQ3JDaUUsRUFBYXhCLEdBQ2JHLEVBQVNaLGFBQWFRLEdBQ3RCeUIsRUFBYXpCLEVBQ2pCLElBc0JNLEVDcEVsQixHIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2dhbWVib2FyZC50cyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvc2hpcC50cyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvcGxheWVyLnRzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9nYW1lLnRzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy91aS50cyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGdhbWVib2FyZEZhY3RvcnkgPSAoKSA9PiB7XG4gICAgY29uc3QgY29scyA9IFsnQScsICdCJywgJ0MnLCAnRCcsICdFJywgJ0YnLCAnRycsICdIJywgJ0knLCAnSiddO1xuICAgIGNvbnN0IHJvd3MgPSBbJzEnLCAnMicsICczJywgJzQnLCAnNScsICc2JywgJzcnLCAnOCcsICc5JywgJzEwJ107XG4gICAgY29uc3QgYXJyYXkgPSBbXTtcbiAgICBjb25zdCBnZW5lcmF0ZUFycmF5ID0gKCkgPT4ge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGFycmF5W2ldID0gW107XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqICs9IDEpIHtcbiAgICAgICAgICAgICAgICBhcnJheVtpXVtqXSA9IHsgY29sOiBjb2xzW2pdLCByb3c6IHJvd3NbaV0sIHN0YXR1czogJ2VtcHR5JywgdGFrZW5CeTogdW5kZWZpbmVkIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIGNvbnN0IGdldENlbGwgPSAoY29sLCByb3cpID0+IHtcbiAgICAgICAgY29uc3QgY29sSW5kZXggPSBjb2xzLmluZGV4T2YoY29sKTtcbiAgICAgICAgY29uc3Qgcm93SW5kZXggPSByb3dzLmluZGV4T2Yocm93KTtcbiAgICAgICAgaWYgKGNvbEluZGV4ID09PSAtMSB8fCByb3dJbmRleCA9PT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhcnJheVtyb3dJbmRleF1bY29sSW5kZXhdO1xuICAgIH07XG4gICAgY29uc3Qgc2V0Q2VsbCA9IChjb2wsIHJvdywgbmV3U3RhdHVzLCBuZXdUYWtlbkJ5KSA9PiB7XG4gICAgICAgIGNvbnN0IGNvbEluZGV4ID0gY29scy5pbmRleE9mKGNvbCk7XG4gICAgICAgIGNvbnN0IHJvd0luZGV4ID0gcm93cy5pbmRleE9mKHJvdyk7XG4gICAgICAgIGlmIChjb2xJbmRleCA9PT0gLTEgfHwgcm93SW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBhcnJheVtyb3dJbmRleF1bY29sSW5kZXhdLnN0YXR1cyA9IG5ld1N0YXR1cztcbiAgICAgICAgaWYgKG5ld1Rha2VuQnkpIHtcbiAgICAgICAgICAgIGFycmF5W3Jvd0luZGV4XVtjb2xJbmRleF0udGFrZW5CeSA9IG5ld1Rha2VuQnk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFycmF5W3Jvd0luZGV4XVtjb2xJbmRleF07XG4gICAgfTtcbiAgICBjb25zdCBwbGFjZVNoaXAgPSAoc2hpcCwgY29sLCByb3csIG9yaWVudGF0aW9uKSA9PiB7XG4gICAgICAgIGNvbnN0IGlzSG9yaXpvbnRhbCA9IG9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCc7XG4gICAgICAgIGNvbnN0IGNlbGxzID0gaXNIb3Jpem9udGFsID8gY29scyA6IHJvd3M7XG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gY2VsbHMuaW5kZXhPZihpc0hvcml6b250YWwgPyBjb2wgOiByb3cpO1xuICAgICAgICBpZiAoc3RhcnQgPCAwIHx8IHN0YXJ0ICsgc2hpcC5zaXplID4gY2VsbHMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLnNpemU7IGkgKz0gMSkge1xuICAgICAgICAgICAgY29uc3QgY3VycmVudENvbCA9IGlzSG9yaXpvbnRhbCA/IGNlbGxzW3N0YXJ0ICsgaV0gOiBjb2w7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50Um93ID0gaXNIb3Jpem9udGFsID8gcm93IDogY2VsbHNbc3RhcnQgKyBpXTtcbiAgICAgICAgICAgIGlmIChnZXRDZWxsKGN1cnJlbnRDb2wsIGN1cnJlbnRSb3cpLnN0YXR1cyAhPT0gJ2VtcHR5Jykge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNldENlbGwoY3VycmVudENvbCwgY3VycmVudFJvdywgJ3Rha2VuJywgc2hpcCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcbiAgICBjb25zdCByZWNlaXZlQXR0YWNrID0gKGNvbCwgcm93KSA9PiB7XG4gICAgICAgIGNvbnN0IGNlbGwgPSBnZXRDZWxsKGNvbCwgcm93KTtcbiAgICAgICAgaWYgKGNlbGwuc3RhdHVzID09PSAndGFrZW4nKSB7XG4gICAgICAgICAgICBjZWxsLnRha2VuQnkuaGl0KCk7XG4gICAgICAgICAgICBzZXRDZWxsKGNvbCwgcm93LCAnaGl0Jyk7XG4gICAgICAgICAgICByZXR1cm4gY2VsbC5zdGF0dXM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNlbGwuc3RhdHVzID09PSAnZW1wdHknKSB7XG4gICAgICAgICAgICBzZXRDZWxsKGNvbCwgcm93LCAnbWlzcycpO1xuICAgICAgICAgICAgcmV0dXJuIGNlbGwuc3RhdHVzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH07XG4gICAgY29uc3QgYWxsU3VuayA9ICgpID0+IHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSArPSAxKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqICs9IDEpIHtcbiAgICAgICAgICAgICAgICBpZiAoYXJyYXlbaV1bal0uc3RhdHVzID09PSAndGFrZW4nICYmICFhcnJheVtpXVtqXS50YWtlbkJ5LmlzU3VuaygpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcbiAgICBnZW5lcmF0ZUFycmF5KCk7XG4gICAgcmV0dXJuIHsgZ2V0Q2VsbCwgcGxhY2VTaGlwLCByZWNlaXZlQXR0YWNrLCBhbGxTdW5rLCBhcnJheSB9O1xufTtcbmV4cG9ydCBkZWZhdWx0IGdhbWVib2FyZEZhY3Rvcnk7XG4iLCJjb25zdCBzaGlwRmFjdG9yeSA9IChuYW1lKSA9PiB7XG4gICAgbGV0IGhpdENvdW50ZXIgPSAwO1xuICAgIGxldCBzaXplO1xuICAgIGlmIChuYW1lID09PSAnQ2FycmllcicpIHtcbiAgICAgICAgc2l6ZSA9IDU7XG4gICAgfVxuICAgIGlmIChuYW1lID09PSAnQmF0dGxlc2hpcCcpIHtcbiAgICAgICAgc2l6ZSA9IDQ7XG4gICAgfVxuICAgIGlmIChuYW1lID09PSAnRGVzdHJveWVyJykge1xuICAgICAgICBzaXplID0gMztcbiAgICB9XG4gICAgaWYgKG5hbWUgPT09ICdTdWJtYXJpbmUnKSB7XG4gICAgICAgIHNpemUgPSAzO1xuICAgIH1cbiAgICBpZiAobmFtZSA9PT0gJ1BhdHJvbCBCb2F0Jykge1xuICAgICAgICBzaXplID0gMjtcbiAgICB9XG4gICAgY29uc3QgaGl0ID0gKCkgPT4ge1xuICAgICAgICBoaXRDb3VudGVyICs9IDE7XG4gICAgfTtcbiAgICBjb25zdCBpc1N1bmsgPSAoKSA9PiB7XG4gICAgICAgIGlmIChoaXRDb3VudGVyID09PSBzaXplKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcbiAgICByZXR1cm4geyBuYW1lLCBzaXplLCBoaXQsIGlzU3VuayB9O1xufTtcbmV4cG9ydCBkZWZhdWx0IHNoaXBGYWN0b3J5O1xuIiwiY29uc3QgcGxheWVyRmFjdG9yeSA9ICgpID0+IHtcbiAgICBjb25zdCBhdHRhY2sgPSAoZ2FtZWJvYXJkLCBjb2wsIHJvdykgPT4ge1xuICAgICAgICBpZiAoZ2FtZWJvYXJkLmdldENlbGwoY29sLCByb3cpLnN0YXR1cyAhPT0gJ2hpdCcgJiYgZ2FtZWJvYXJkLmdldENlbGwoY29sLCByb3cpLnN0YXR1cyAhPT0gJ21pc3MnKSB7XG4gICAgICAgICAgICByZXR1cm4gZ2FtZWJvYXJkLnJlY2VpdmVBdHRhY2soY29sLCByb3cpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAnYWxyZWFkeSBzaG90JztcbiAgICB9O1xuICAgIGNvbnN0IHJhbmRvbUF0dGFjayA9IChnYW1lYm9hcmQpID0+IHtcbiAgICAgICAgY29uc3QgY29scyA9IFsnQScsICdCJywgJ0MnLCAnRCcsICdFJywgJ0YnLCAnRycsICdIJywgJ0knLCAnSiddO1xuICAgICAgICBsZXQgcmFuZG9tQ29sO1xuICAgICAgICBsZXQgcmFuZG9tUm93O1xuICAgICAgICBkbyB7XG4gICAgICAgICAgICByYW5kb21Db2wgPSBjb2xzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNvbHMubGVuZ3RoKV07XG4gICAgICAgICAgICByYW5kb21Sb3cgPSBNYXRoLmNlaWwoTWF0aC5yYW5kb20oKSAqIDEwKS50b1N0cmluZygpO1xuICAgICAgICB9IHdoaWxlIChnYW1lYm9hcmQuZ2V0Q2VsbChyYW5kb21Db2wsIHJhbmRvbVJvdykuc3RhdHVzID09PSAnaGl0JyB8fCBnYW1lYm9hcmQuZ2V0Q2VsbChyYW5kb21Db2wsIHJhbmRvbVJvdykuc3RhdHVzID09PSAnbWlzcycpO1xuICAgICAgICBpZiAoZ2FtZWJvYXJkLmdldENlbGwocmFuZG9tQ29sLCByYW5kb21Sb3cpLnN0YXR1cyAhPT0gJ2hpdCcgJiYgZ2FtZWJvYXJkLmdldENlbGwocmFuZG9tQ29sLCByYW5kb21Sb3cpLnN0YXR1cyAhPT0gJ21pc3MnKSB7XG4gICAgICAgICAgICByZXR1cm4gZ2FtZWJvYXJkLnJlY2VpdmVBdHRhY2socmFuZG9tQ29sLCByYW5kb21Sb3cpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAnYWxyZWFkeSBzaG90JztcbiAgICB9O1xuICAgIHJldHVybiB7IGF0dGFjaywgcmFuZG9tQXR0YWNrIH07XG59O1xuZXhwb3J0IGRlZmF1bHQgcGxheWVyRmFjdG9yeTtcbiIsImltcG9ydCBnYW1lYm9hcmRGYWN0b3J5IGZyb20gJy4vZ2FtZWJvYXJkJztcbmltcG9ydCBzaGlwRmFjdG9yeSBmcm9tICcuL3NoaXAnO1xuaW1wb3J0IHBsYXllckZhY3RvcnkgZnJvbSAnLi9wbGF5ZXInO1xuY29uc3QgaHVtYW5HYW1lYm9hcmQgPSBnYW1lYm9hcmRGYWN0b3J5KCk7XG5jb25zdCBjb21wdXRlckdhbWVib2FyZCA9IGdhbWVib2FyZEZhY3RvcnkoKTtcbmNvbnN0IGh1bWFuID0gcGxheWVyRmFjdG9yeSgpO1xuY29uc3QgY29tcHV0ZXIgPSBwbGF5ZXJGYWN0b3J5KCk7XG5jb25zdCBwb3B1bGF0ZUdhbWVib2FyZCA9ICgpID0+IHtcbiAgICBjb25zdCBjYXJyaWVyID0gc2hpcEZhY3RvcnkoJ0NhcnJpZXInKTtcbiAgICBjb25zdCBiYXR0bGVzaGlwID0gc2hpcEZhY3RvcnkoJ0JhdHRsZXNoaXAnKTtcbiAgICBjb25zdCBkZXN0cm95ZXIgPSBzaGlwRmFjdG9yeSgnRGVzdHJveWVyJyk7XG4gICAgY29uc3Qgc3VibWFyaW5lID0gc2hpcEZhY3RvcnkoJ1N1Ym1hcmluZScpO1xuICAgIGNvbnN0IHBhdHJvbGJvYXQgPSBzaGlwRmFjdG9yeSgnUGF0cm9sIEJvYXQnKTtcbiAgICBodW1hbkdhbWVib2FyZC5wbGFjZVNoaXAoY2FycmllciwgJ0EnLCAnMScsICdob3Jpem9udGFsJyk7XG4gICAgaHVtYW5HYW1lYm9hcmQucGxhY2VTaGlwKGJhdHRsZXNoaXAsICdBJywgJzMnLCAnaG9yaXpvbnRhbCcpO1xuICAgIGh1bWFuR2FtZWJvYXJkLnBsYWNlU2hpcChkZXN0cm95ZXIsICdBJywgJzUnLCAnaG9yaXpvbnRhbCcpO1xuICAgIGh1bWFuR2FtZWJvYXJkLnBsYWNlU2hpcChzdWJtYXJpbmUsICdBJywgJzcnLCAnaG9yaXpvbnRhbCcpO1xuICAgIGh1bWFuR2FtZWJvYXJkLnBsYWNlU2hpcChwYXRyb2xib2F0LCAnQScsICc5JywgJ2hvcml6b250YWwnKTtcbiAgICBjb21wdXRlckdhbWVib2FyZC5wbGFjZVNoaXAoY2FycmllciwgJ0EnLCAnMScsICd2ZXJ0aWNhbCcpO1xuICAgIGNvbXB1dGVyR2FtZWJvYXJkLnBsYWNlU2hpcChiYXR0bGVzaGlwLCAnQycsICcxJywgJ3ZlcnRpY2FsJyk7XG4gICAgY29tcHV0ZXJHYW1lYm9hcmQucGxhY2VTaGlwKGRlc3Ryb3llciwgJ0UnLCAnMScsICd2ZXJ0aWNhbCcpO1xuICAgIGNvbXB1dGVyR2FtZWJvYXJkLnBsYWNlU2hpcChzdWJtYXJpbmUsICdHJywgJzEnLCAndmVydGljYWwnKTtcbiAgICBjb21wdXRlckdhbWVib2FyZC5wbGFjZVNoaXAocGF0cm9sYm9hdCwgJ0knLCAnMScsICd2ZXJ0aWNhbCcpO1xufTtcbnBvcHVsYXRlR2FtZWJvYXJkKCk7XG4vLyBDcmVhdGUgY29uZGl0aW9ucyBzbyB0aGF0IHRoZSBnYW1lIGVuZHMgb25jZSBvbmUgcGxheWVy4oCZcyBzaGlwcyBoYXZlIGFsbCBiZWVuIHN1bmsuIFRoaXMgZnVuY3Rpb24gaXMgYXBwcm9wcmlhdGUgZm9yIHRoZSBHYW1lIG1vZHVsZS5cbi8vIGh1bWFuLmF0dGFjayhjb21wdXRlckdhbWVib2FyZCwgJ0EnLCAnMScpO1xuLy8gY29tcHV0ZXIucmFuZG9tQXR0YWNrKGh1bWFuR2FtZWJvYXJkKTtcbi8vIGNvbXB1dGVyLnJhbmRvbUF0dGFjayhodW1hbkdhbWVib2FyZCk7XG4vLyBjb21wdXRlci5yYW5kb21BdHRhY2soaHVtYW5HYW1lYm9hcmQpO1xuLy8gY29tcHV0ZXIucmFuZG9tQXR0YWNrKGh1bWFuR2FtZWJvYXJkKTtcbi8vIGNvbXB1dGVyLnJhbmRvbUF0dGFjayhodW1hbkdhbWVib2FyZCk7XG5leHBvcnQgeyBodW1hbkdhbWVib2FyZCwgY29tcHV0ZXJHYW1lYm9hcmQsIGh1bWFuLCBjb21wdXRlciB9O1xuIiwiaW1wb3J0IHsgaHVtYW5HYW1lYm9hcmQsIGNvbXB1dGVyR2FtZWJvYXJkLCBodW1hbiwgY29tcHV0ZXIgfSBmcm9tICcuL2dhbWUnO1xuY29uc3QgdWkgPSAoKSA9PiB7XG4gICAgY29uc3Qgd3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHdyYXBwZXIuaWQgPSAnd3JhcHBlcic7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmQod3JhcHBlcik7XG4gICAgY29uc3QgY3JlYXRlQ2VsbCA9IChjb2wpID0+IHtcbiAgICAgICAgY29uc3QgY2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoJ2NlbGwnKTtcbiAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKGNvbC5zdGF0dXMpO1xuICAgICAgICBjZWxsLnNldEF0dHJpYnV0ZSgnZGF0YS1jb2wnLCBjb2wuY29sKTtcbiAgICAgICAgY2VsbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtcm93JywgY29sLnJvdyk7XG4gICAgICAgIHJldHVybiBjZWxsO1xuICAgIH07XG4gICAgY29uc3QgcmVuZGVyQ2VsbHMgPSAoZ2FtZWJvYXJkLCBib2FyZCkgPT4ge1xuICAgICAgICBnYW1lYm9hcmQuYXJyYXkuZm9yRWFjaCgocm93KSA9PiB7XG4gICAgICAgICAgICByb3cuZm9yRWFjaCgoY29sKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2VsbCA9IGNyZWF0ZUNlbGwoY29sKTtcbiAgICAgICAgICAgICAgICBib2FyZC5hcHBlbmQoY2VsbCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBjb25zdCByZW5kZXJCb2FyZCA9IChnYW1lYm9hcmQpID0+IHtcbiAgICAgICAgY29uc3QgYm9hcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgYm9hcmQuY2xhc3NMaXN0LmFkZCgnYm9hcmQnKTtcbiAgICAgICAgaWYgKGdhbWVib2FyZCA9PT0gaHVtYW5HYW1lYm9hcmQpIHtcbiAgICAgICAgICAgIGJvYXJkLmlkID0gJ2ZpcnN0Qm9hcmQnO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGdhbWVib2FyZCA9PT0gY29tcHV0ZXJHYW1lYm9hcmQpIHtcbiAgICAgICAgICAgIGJvYXJkLmlkID0gJ3NlY29uZEJvYXJkJztcbiAgICAgICAgfVxuICAgICAgICByZW5kZXJDZWxscyhnYW1lYm9hcmQsIGJvYXJkKTtcbiAgICAgICAgd3JhcHBlci5hcHBlbmQoYm9hcmQpO1xuICAgIH07XG4gICAgY29uc3QgcmVmcmVzaEJvYXJkID0gKGdhbWVib2FyZCkgPT4ge1xuICAgICAgICBjb25zdCBib2FyZElkID0gZ2FtZWJvYXJkID09PSBodW1hbkdhbWVib2FyZCA/ICdmaXJzdEJvYXJkJyA6ICdzZWNvbmRCb2FyZCc7XG4gICAgICAgIGNvbnN0IGJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgIyR7Ym9hcmRJZH1gKTtcbiAgICAgICAgYm9hcmQuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIHJlbmRlckNlbGxzKGdhbWVib2FyZCwgYm9hcmQpO1xuICAgIH07XG4gICAgY29uc3QgZ2V0VXNlcklucHV0ID0gKCkgPT4ge1xuICAgICAgICBjb25zdCBzZWNvbmRCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzZWNvbmRCb2FyZCcpO1xuICAgICAgICBzZWNvbmRCb2FyZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgICAgICBpZiAoIWUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnaGl0JykgJiYgIWUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnbWlzcycpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY29sID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWNvbCcpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJvdyA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1yb3cnKTtcbiAgICAgICAgICAgICAgICBodW1hbi5hdHRhY2soY29tcHV0ZXJHYW1lYm9hcmQsIGNvbCwgcm93KTtcbiAgICAgICAgICAgICAgICByZWZyZXNoQm9hcmQoY29tcHV0ZXJHYW1lYm9hcmQpO1xuICAgICAgICAgICAgICAgIGNvbXB1dGVyLnJhbmRvbUF0dGFjayhodW1hbkdhbWVib2FyZCk7XG4gICAgICAgICAgICAgICAgcmVmcmVzaEJvYXJkKGh1bWFuR2FtZWJvYXJkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvLyBjb25zdCBnZXRVc2VySW5wdXQgPSAoKSA9PiB7XG4gICAgLy8gXHRjb25zdCBzZWNvbmRCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzZWNvbmRCb2FyZCcpO1xuICAgIC8vIFx0bGV0IGlzQ29tcHV0ZXJBdHRhY2tpbmcgPSBmYWxzZTtcbiAgICAvLyBcdHNlY29uZEJvYXJkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKGUpID0+IHtcbiAgICAvLyBcdFx0aWYgKCFpc0NvbXB1dGVyQXR0YWNraW5nICYmICEoZS50YXJnZXQgYXMgRWxlbWVudCkuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaXQnKSAmJiAhKGUudGFyZ2V0IGFzIEVsZW1lbnQpLmNsYXNzTGlzdC5jb250YWlucygnbWlzcycpKSB7XG4gICAgLy8gXHRcdFx0Y29uc3QgY29sID0gKGUudGFyZ2V0IGFzIEVsZW1lbnQpLmdldEF0dHJpYnV0ZSgnZGF0YS1jb2wnKTtcbiAgICAvLyBcdFx0XHRjb25zdCByb3cgPSAoZS50YXJnZXQgYXMgRWxlbWVudCkuZ2V0QXR0cmlidXRlKCdkYXRhLXJvdycpO1xuICAgIC8vIFx0XHRcdGh1bWFuLmF0dGFjayhjb21wdXRlckdhbWVib2FyZCwgY29sLCByb3cpO1xuICAgIC8vIFx0XHRcdHJlZnJlc2hCb2FyZChjb21wdXRlckdhbWVib2FyZCk7XG4gICAgLy8gXHRcdFx0aXNDb21wdXRlckF0dGFja2luZyA9IHRydWU7XG4gICAgLy8gXHRcdFx0YXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDEwMDApKTtcbiAgICAvLyBcdFx0XHRjb21wdXRlci5yYW5kb21BdHRhY2soaHVtYW5HYW1lYm9hcmQpO1xuICAgIC8vIFx0XHRcdHJlZnJlc2hCb2FyZChodW1hbkdhbWVib2FyZCk7XG4gICAgLy8gXHRcdFx0aXNDb21wdXRlckF0dGFja2luZyA9IGZhbHNlO1xuICAgIC8vIFx0XHR9XG4gICAgLy8gXHR9KTtcbiAgICAvLyB9O1xuICAgIHJlbmRlckJvYXJkKGh1bWFuR2FtZWJvYXJkKTtcbiAgICByZW5kZXJCb2FyZChjb21wdXRlckdhbWVib2FyZCk7XG4gICAgZ2V0VXNlcklucHV0KCk7XG59O1xuZXhwb3J0IGRlZmF1bHQgdWk7XG4iLCJpbXBvcnQgJ25vcm1hbGl6ZS5jc3MnO1xuaW1wb3J0ICcuL3N0eWxlL3N0eWxlLmNzcyc7XG5pbXBvcnQgdWkgZnJvbSAnLi9tb2R1bGVzL3VpJztcbnVpKCk7XG4iXSwibmFtZXMiOlsiY29scyIsInJvd3MiLCJhcnJheSIsImdldENlbGwiLCJjb2wiLCJyb3ciLCJjb2xJbmRleCIsImluZGV4T2YiLCJyb3dJbmRleCIsInNldENlbGwiLCJuZXdTdGF0dXMiLCJuZXdUYWtlbkJ5Iiwic3RhdHVzIiwidGFrZW5CeSIsImkiLCJqIiwidW5kZWZpbmVkIiwiZ2VuZXJhdGVBcnJheSIsInBsYWNlU2hpcCIsInNoaXAiLCJvcmllbnRhdGlvbiIsImlzSG9yaXpvbnRhbCIsImNlbGxzIiwic3RhcnQiLCJzaXplIiwibGVuZ3RoIiwiY3VycmVudENvbCIsImN1cnJlbnRSb3ciLCJyZWNlaXZlQXR0YWNrIiwiY2VsbCIsImhpdCIsImFsbFN1bmsiLCJpc1N1bmsiLCJuYW1lIiwiaGl0Q291bnRlciIsImF0dGFjayIsImdhbWVib2FyZCIsInJhbmRvbUF0dGFjayIsInJhbmRvbUNvbCIsInJhbmRvbVJvdyIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImNlaWwiLCJ0b1N0cmluZyIsImh1bWFuR2FtZWJvYXJkIiwiY29tcHV0ZXJHYW1lYm9hcmQiLCJodW1hbiIsInBsYXllciIsImNvbXB1dGVyIiwiY2FycmllciIsImJhdHRsZXNoaXAiLCJkZXN0cm95ZXIiLCJzdWJtYXJpbmUiLCJwYXRyb2xib2F0IiwicG9wdWxhdGVHYW1lYm9hcmQiLCJ3cmFwcGVyIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiaWQiLCJib2R5IiwiYXBwZW5kIiwicmVuZGVyQ2VsbHMiLCJib2FyZCIsImZvckVhY2giLCJjbGFzc0xpc3QiLCJhZGQiLCJzZXRBdHRyaWJ1dGUiLCJjcmVhdGVDZWxsIiwicmVuZGVyQm9hcmQiLCJyZWZyZXNoQm9hcmQiLCJib2FyZElkIiwicXVlcnlTZWxlY3RvciIsImlubmVySFRNTCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwidGFyZ2V0IiwiY29udGFpbnMiLCJnZXRBdHRyaWJ1dGUiXSwic291cmNlUm9vdCI6IiJ9