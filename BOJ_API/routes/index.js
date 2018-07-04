const express = require('express');
const jsdom = require('jsdom');
const request = require('request');
const cheerio = require('cheerio');
const { JSDOM } = jsdom;
const router = express.Router();

const baseURL = "https://www.acmicpc.net";

router.get('/categoryList', function(req, res, next) {
	let categoryList = [];
  const url = "https://www.acmicpc.net/problem/tags"; // 알고리즘 분류
  request(url, function(err, response, body) {
  	const $ = cheerio.load(body);
  	const tb = $('tr', 'tbody');
  	tb.each(function() {

  		let obj = {
  			link: $('a', this).attr('href'),
  			name: '',
  			num: 0,
  		};
  		$('td', this).each(function(index) {
  			if(index === 0) obj.name = $(this).text();
  			if(index === 1) obj.num = $(this).text();
  		});
  		categoryList.push(obj);
  	});
  	console.log(categoryList);
  	res.send(categoryList);
  });
});

router.get('/problem/tag/:targetCategory', function(req, res, next) {
	let problemList = [];
	const target = req.params.targetCategory;
	const url = encodeURI(`${baseURL}/problem/tag/${target}`);

	request(url, function(err, response, body) {
		if(err) {
			console.log(err);
			res.end(err);
		} else {
			const $ = cheerio.load(body);
			$('tbody tr', '#problemset').each(function(index, elm) {
				const problem = {
					id : $('.list_problem_id', this).text(),
				  link : $('.click-this a', this).attr('href'),
				  name : $('.click-this', this).text(),
				  ratio : 0,
				};
				$('td', this).each(function(index) {
					if(index === 5) problem.ratio = $(this).text();
				});
				problemList.push(problem);
			});

			console.log(problemList);
			res.send(problemList);
		}
	})
});

router.get('/problem/user/:id/solve', function (req, res, next) {
	let problemList = [];
	let user_id = req.params.id;

	const url = encodeURI(`${baseURL}/user/${user_id}`);

	request(url, function(err, response, body) {
		if(err) {
			console.log(err);
			res.end(err);
		} else {
			const $ = cheerio.load(body);
			$('.panel').slice(0,1).each(function(index, elm) {
				problemList.push($(,this).text());
			});
			res.send(problemList);
		}
	})
});

router.get('/problem/user/fail', function (req, res, next) {

});

router.get('/random/:problemNum', function (req, res, next) {

});

router.get('/login', function(req, res, next) {

});
module.exports = router;
