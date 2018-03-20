'use strict';

function Article (rawDataObj) {
  this.author = rawDataObj.author;
  this.authorUrl = rawDataObj.authorUrl;
  this.title = rawDataObj.title;
  this.category = rawDataObj.category;
  this.body = rawDataObj.body;
  this.publishedOn = rawDataObj.publishedOn;
}

// REVIEW: Instead of a global `articles = []` array, let's attach this list of all articles directly to the constructor function. Note: it is NOT on the prototype. In JavaScript, functions are themselves objects, which means we can add properties/values to them at any time. In this case, the array relates to ALL of the Article objects, so it does not belong on the prototype, as that would only be relevant to a single instantiated Article.
Article.all = [];

// COMMENT: Why isn't this method written as an arrow function?
// This method has a contextual 'this' in it, referring to 'Article'. With an arrow function, the contextual 'this' would be scoped erroneously and 'this' wouldn't be recognized.

Article.prototype.toHtml = function() {
  let template = Handlebars.compile($('#article-template').text());

  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);

  // COMMENT: What is going on in the line below? What do the question mark and colon represent? How have we seen this same logic represented previously?
  // Not sure? Check the docs!
  // The question mark and colon are shorthand for an 'if, else' statement. The conditino before the question mark is tested, based on whether it is true or false, the code before or after the colon is run, respectively. The code asks whether this.publishedOn has a truthy value, and updates this.publishStatus accordingly with a date message (true) or a draft status (false).

  this.publishStatus = this.publishedOn ? `published ${this.daysAgo} days ago` : '(draft)';
  this.body = marked(this.body);

  return template(this);
};

// REVIEW: There are some other functions that also relate to all articles across the board, rather than just single instances. Object-oriented programming would call these "class-level" functions, that are relevant to the entire "class" of objects that are Articles.

// REVIEW: This function will take the rawData, how ever it is provided, and use it to instantiate all the articles. This code is moved from elsewhere, and encapsulated in a simply-named function for clarity.

// COMMENT: Where is this function called? What does 'rawData' represent now? How is this different from previous labs?

// This function is called in Article.fetchall, but only if rawData exists in local storage. rawData represents the data set to local storage. In previous labs the data was directly from another Javascript file; it was never set into local storage or retrieved. 

Article.loadAll = articleData => {
  articleData.sort((a,b) => (new Date(b.publishedOn)) - (new Date(a.publishedOn)))

  articleData.forEach(articleObject => Article.all.push(new Article(articleObject)))
}

// REVIEW: This function will retrieve the data from either a local or remote source, and process it, then hand off control to the View.
Article.fetchAll = () => {
  // REVIEW: What is this 'if' statement checking for? Where was the rawData set to local storage? 

  if (localStorage.rawData) {
//
    let localStorageData = JSON.parse(localStorage.getItem('rawData'));
    Article.loadAll(localStorageData);

  } else {
    $.getJSON('../data/hackeripsum.json')
      .then(
        function(data) {
          console.log(data);
          localStorage.setItem('rawData', JSON.stringify(data))},
        function(err) {
          console.error(err)}
      );
    let localStorageData = JSON.parse(localStorage.getItem('rawData'));
    Article.loadAll(localStorageData);
  }
}
//Before else, the code represents if local storage.rawdata does exist, else we grab the data then we set it.  After setting in order for us to retreive and read the data, the act of parsing must be included in the end.  