import React, { Component } from 'react';

import './App.css';

class App extends Component {
  state = {
    articleIds: [],
    articles: [],
    currentIndex: 0
  };

  async componentDidMount() {
    await this.fetchArticleIds();
    await this.fetchArticle(0);
  }

  async fetchArticleIds() {
    try {
      const res = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
      const articleIds = await res.json();
      this.setState({articleIds});
    }
    catch (error) {
      console.error(error);
    }
  }

  async fetchArticle(index) {
    try {
      const itemId = this.state.articleIds[index];
      const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${itemId}.json`);
      const articlesCopy = this.state.articles.slice(0);
      const article = await res.json();
      articlesCopy.splice(index, 0, article);
      this.setState({articles: articlesCopy});
    }
    catch (error) {
      console.error(error);
    }
  }

  next = async () => {
    const newIndex = this.state.currentIndex + 1;
    if (!this.state.articles[newIndex]) {
      await this.fetchArticle(newIndex);
    }
    this.setState({currentIndex: newIndex});
  }

  previous = () => {
    this.setState({currentIndex: this.state.currentIndex - 1});
  }

  loadArticle() {
    if (this.state.articles[this.state.currentIndex]) {
      return (
        <iframe 
          src={this.state.articles[this.state.currentIndex].url}
          className="iframe"
        />
      );
    }
  }

  render() {
    console.log(this.state);
    return (
      <div className="app">
        <header className="header">
          <h1 className="title">Hacker News Explorer</h1>
          <button onClick={this.previous}>Previous</button>
          <button onClick={this.next}>Next</button>
        </header>
        {this.loadArticle()}
      </div>
    );
  }
}

export default App;
