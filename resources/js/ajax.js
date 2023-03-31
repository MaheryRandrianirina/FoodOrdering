
/**
 * 
 * @param {string} url 
 */
export function get(url){
    return new Promise(function(resolve, reject){
        let xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function(){
            if(xhr.readyState === 4){
                if(xhr.status === 200){
                    resolve(xhr.responseText)
                }else{
                    reject(xhr)
                }
                
            }
        }

        xhr.open('GET', url)
        xhr.send()
    })   
}

/**
 * 
 * @param {string} url 
 * @param {{"name": value}}  posts
 */
export function post(url, posts){

    return new Promise(function(resolve, reject){
        let xhr = new XMLHttpRequest()
        let data = new FormData()
        
        for(const post in posts){
            data.append(post, posts[post])
        }
    
        xhr.onreadystatechange = function(){
            
            if(xhr.readyState === 4){
                if(xhr.status === 200){
                    resolve(xhr.responseText)
                }else{
                    reject(xhr)
                }
                
            }
        }
        
        xhr.open('POST', url)
        xhr.setRequestHeader('Accept', 'application/json')
        xhr.send(data)
    }) 
}