import styled, { createGlobalStyle } from 'styled-components';

export const Button = styled.button`
  -webkit-appearance: none;
  background-color: #ff0044;
  border: 0;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  color: #fff;
  font-size: 22px;
  line-height: 1;
  padding: 4px 12px;
`;

export const Disclaimer = styled.div`
  color: #444;
  font-size: 13px;
  margin: 5px auto 0;
  max-width: 320px;
  text-align: center;

  p {
    font-size: 18px;
    font-weight: bold;
  }

  a {
    color: #ff0044;
  }
`;

export const Form = styled.form`
  display: flex;
  justify-content: center;
  text-align: center;
  width: 100%;
`;

export const GlobalStyles = createGlobalStyle`
  body {
		background-color: #f7f7f7;
		box-sizing: border-box;
		font-family: sans-serif;
		margin: 0;
		min-height: 100vh;
		padding: 0 0 100px;
	}

	.github-corner {
		position: fixed;
		top: 0;
		right: 0;
	}

	.github-corner svg {
		fill: #ff0044;
		color: #fff;
	}

	.github-corner .octo-arm {
		transform-origin: 130px 106px;
	}

	.github-corner:hover .octo-arm {
		animation: octocat-wave 560ms ease-in-out;
	}

	@keyframes octocat-wave {
		0%,
		100% {
			transform: rotate(0);
		}
		20%,
		60% {
			transform: rotate(-25deg);
		}
		40%,
		80% {
			transform: rotate(10deg);
		}
	}

	@media (max-width: 500px) {
		.github-corner:hover .octo-arm {
			animation: none;
		}

		.github-corner .octo-arm {
			animation: octocat-wave 560ms ease-in-out;
		}
	}
`;

export const Heading = styled.h1`
  color: #ff0044;
  font-size: 24px;
  margin-bottom: 40px;
  margin-top: 0;
  padding-top: 60px;
  text-align: center;
`;

export const Input = styled.input`
  -webkit-appearance: none;
  border: 1px solid #ff0044;
  border-right: 0;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  box-sizing: border-box;
  font-size: 18px;
  line-height: 1;
  width: 240px;
  padding: 6px 12px;
`;

export const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const Player = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
`;

export const ScopeTitle = styled.h4`
  margin: 10px 0;
`;

export const Selector = styled.div`
  margin: 30px auto 0;
  max-width: 320px;
  text-align: center;

  button {
    appearance: none;
    background-color: #ff0044;
    border: 0;
    color: #fff;
    display: inline-flex;
    font-size: 16px;
    margin: 0 0 10px;
    padding: 6px 10px;

    + button {
      margin-left: 10px;
    }
  }
`;
