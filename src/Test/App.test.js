/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import {fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

describe("Tests <App /> in it's entirety", () => {
  beforeEach(() => {
    global.fetch = jest.fn((_url, options) => {
      const body = JSON.parse(options.body);
      if (body.message === 'how much is 5 + 5 ?') {
        return Promise.resolve({
          json: () => Promise.resolve({ choices: [{ message: { role: "bot", content: "5 + 5 is 10." } }] }),
          ok: true
        });
      }
      return Promise.reject('Unknown question'); 
    });

  const localStorageMock = (function() {
      let store = {};
      return {
        getItem: function(key) {
          return store[key] || null;
        },
        setItem: function(key, value) {
          store[key] = value.toString();
        },
        clear: function() {
          store = {};
        },
        removeItem: function(key) {
          delete store[key];
        }
      };
    })();
    
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  });


  test("Header rendering", () => {
    render(<App />)
    const header = screen.getByRole('heading', { name: "GusGPT" });
    expect(header).toBeInTheDocument();
  });

  test('integration test: submit message, get response, check localStorage and render', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText('send message');
    const submitButton = screen.getByTestId('submit');

    fireEvent.change(input, { target: { value: 'how much is 5 + 5 ?' } });
    userEvent.click(submitButton);

    const userElement = await screen.findByText("user :")
    const questionText = await screen.findByText("how much is 5 + 5 ?");
    const responseElement = await screen.findByText("bot :");
    const responseText = await screen.findByText("5 + 5 is 10.");

    expect(questionText).toBeInTheDocument();
    expect(userElement).toBeInTheDocument();
    expect(responseElement).toBeInTheDocument();
    expect(responseText).toBeInTheDocument();

    expect(global.fetch).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      const storedChats = JSON.parse(window.localStorage.getItem('chatKey'));
      expect(storedChats).toHaveLength(2);
      expect(storedChats[0].content).toBe("how much is 5 + 5 ?")
      expect(storedChats[1].content).toBe("5 + 5 is 10.");
   });

    const historyChat = await screen.findByText("how much i...");
    const deleteButton = await screen.findByTestId("trash-can-0");

    expect(historyChat).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();

    userEvent.click(deleteButton);
    await waitFor(() => {
      expect(historyChat).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(deleteButton).not.toBeInTheDocument();
    });

  }); 

  test("Side-bar render with hystory and it's elements", async () => {
    render(<App />)

    const input = screen.getByPlaceholderText('send message');
    const submitButton = screen.getByTestId('submit');

    fireEvent.change(input, { target: { value: 'how much is 5 + 5 ?' } });
    userEvent.click(submitButton);

    const userElement = await screen.findByText("user :")
    const questionText = await screen.findByText("how much is 5 + 5 ?");
    const responseElement = await screen.findByText("bot :");
    const responseText = await screen.findByText("5 + 5 is 10.");

    expect(questionText).toBeInTheDocument();
    expect(userElement).toBeInTheDocument();
    expect(responseElement).toBeInTheDocument();
    expect(responseText).toBeInTheDocument();

    expect(global.fetch).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      const storedChats = JSON.parse(window.localStorage.getItem('chatKey'));
      expect(storedChats).toHaveLength(2);
      expect(storedChats[0].content).toBe("how much is 5 + 5 ?")
      expect(storedChats[1].content).toBe("5 + 5 is 10.");
   });

    const newChatButton = await screen.findByTestId("newChatButton");

    expect(newChatButton).toBeInTheDocument();

    userEvent.click(newChatButton);

    await waitFor(() => {
      expect(questionText).not.toBeInTheDocument();
      expect(userElement).not.toBeInTheDocument();
    expect(responseElement).not.toBeInTheDocument();
    expect(responseText).not.toBeInTheDocument();

    })

    const sideBarFooter = screen.getByText("Made by Gus Ferreira");
    const footer = screen.getByTestId("footer");
    expect(footer).toBeInTheDocument();
    expect(sideBarFooter).toBeInTheDocument();
  });
});

