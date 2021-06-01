const form = document.getElementById('customer-search-form');

form.addEventListener('submit', async function (e) {
	e.preventDefault();
	const search = document.querySelector('input#customer-search').value;
	await fetch(`/search?q=${search}`)
		.then(res => res.json())
		.then(data => {
			clearSearchResults();
			let ul = document.createElement('ul');
			for (let c of data) {
				let li = document.createElement('li');
				let a = document.createElement('a');
				a.href = `/${c.id}`;
				a.innerText = `${c.firstName} ${c.lastName}`;
				li.append(a);
				ul.append(li);
			}
			document.getElementById('search-results').append(ul);
		});
});

function clearSearchResults() {
	document.getElementById('search-results').innerText = '';
}
