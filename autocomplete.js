//debouncer for delaying the request to api
const debounce = (func, delay=1000) => {
    let timeoutId;
    return (...args)=> {
      if(timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func.apply(null, args);
      }, delay);
    };
}

const createAutoComplete = ({ root, renderOption, onOptionSelect, inputValue, fetchData }) => {

  root.innerHTML = `
    <div class="dropdown">
      <input class="dropdown-toggle" type="text" placeholder="Search movies" data-toggle="dropdown"
        aria-haspopup="true" aria-expanded="true" />
      <div class="dropdown-menu scroll"> </div>
    </div>
  `;

  const input = root.querySelector("input");
  const dropdown = root.querySelector(".dropdown");
  const dropdownMenu = root.querySelector(".dropdown-menu");

  //function for input field. Displays suggestions
  const onInput = async (event) =>{
      const items = await fetchData(event.target.value);
      dropdownMenu.innerHTML = '';
      if(items.length>0) {
        for(let item of items) {
          const option = document.createElement("a");
          option.classList.add("dropdown-item");
          option.innerHTML = renderOption(item);
          dropdownMenu.appendChild(option);
          option.addEventListener("click", function() {
            input.value = inputValue(item);
            onOptionSelect(item);
          });
        }
      } else {
          if(input.value.length==0) {
            message("a", "Search to get some suggestions.", dropdownMenu);

          } else {
            message("a", "No movies found", dropdownMenu);
          }
      }
  };

    //function to display message
    const message = (type, msg, parent) => {
      const ele = document.createElement(type);
      ele.classList.add("dropdown-item", "disabled");
      ele.innerHTML = msg;
      parent.appendChild(ele);
    }

    input.addEventListener("input", debounce(onInput, 1000));
}
