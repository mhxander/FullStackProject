import config from './config';

//Data class is used throughout the App.  It helps share the necessary data using various functions.
export default class Data {
    api(
        path,
        method = 'GET',
        body = null,
        requiresAuth = false,
        credentials = null) {
            const url = config.apiBaseUrl + path;
        
            const options = {
                method,
                headers: {
                    'Context-Type': 'application/json; charset=utf-8'
                }
            }

            if (body !== null) {
                options.body = JSON.stringify(body);
            }

            if (requiresAuth) {
                const encodedCredentials = btoa(`${credentials.emailAddress}:${credentials.password}`);
                options.headers['Authorization'] = `Basic ${encodedCredentials}`;
            }
            return fetch(url, options);
    }


    //Make GET request for new user
    async getUser(emailAddress, password) {
        const response = await this.api(`/users`, 'GET', null, true, { emailAddress, password });
        if (response.status === 200) {
            return response.json().then(data => data);
        }
        else if (response.status === 401) {
            return null;
        }
        else {
            throw new Error();
        }
    }

    //Make POST request for new user
    async createUser(user) {
        const response = await this.api('/users', 'POST', user);
        if (response.status === 201) {
            return [];
        }
        else if (response.status === 400) {
            return response.json().then(data => {
                return data.errors;
            });
        }
        else {
            throw new Error(); 
        }
    }

    //Make GET request for all courses
    async getCourse() {
        const response = await this.api('/courses', 'GET'); 
        if (response.status === 200) {
            return response.json().then(data => data);
        }
        else if (response.status === 404) {
            return null;
        }
        else {
            console.log(response.status)
            throw new Error();
        }
    }

    //Make POST request to create a course
    async createCourse(course, emailAddress, password){
        const response = await this.api('/courses', 'POST', course, true, { 
            emailAddress,
            password
        });
        if (response.status === 201) {
            return [];
        } else if (response.status === 400) { 
            return response.json().then(data => {
                return data.errors;
            });
        } else {
            throw new Error();
        }
    }

    //Make GET request for a course
    async courseDetails(id){
        const response = await this.api(`/courses/${id}`, 'GET');
        if (response.status === 200) {
            return response.json().then(data => data);
        }
        else if (response.status === 404) {
            return null;
        }
        else {
            throw new Error(); 
        }
    }

    //Make PUT request to edit a course
    async updateCourse(id, course, emailAddress, password) {
        const response = await this.api(`/courses/${id}`, 'PUT', course, true, {
            emailAddress, 
            password,
            });
        if (response.status === 204) {
            return [];
        }
        else if (response.status === 400 || 
                response.status === 401 || 
                response.status === 403) {
            return response.json()
            .then(data => {
                return data.errors;
            });
        } else {
            throw new Error();
        }
    }

    //Make DELETE request to delete a course
    async deleteCourse(id, emailAddress, password) {
        const response = await this.api(`/courses/${id}`, 'DELETE', null, true, {
            emailAddress,
            password,
        });
        // if the response was successful, than return an empty array
        if(response.status === 204) {
            return [];
        }
        else if(response.status === 403) {
                    return response.json().then(data => {
                        return data.errors;
                    });
        } else {
            throw new Error();
        }
    }
}