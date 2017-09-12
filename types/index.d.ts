/**
 * Type Definitions for Web MIDI API.
 * By Drew Diamantoukos
 *
 * API defined by https://webaudio.github.io/web-midi-api/
 */

interface INavigator {
  /**
   * When invoked, returns a Promise object representing a request for access to MIDI devices on
   * the user's system.
   * Requesting MIDI access should prompt the user for access to MIDI devices, particularly if
   * system exclusive access is requested. In some scenarios, this permission may have already been
   * implicitly or explicitly granted, in which case this prompt may not appear.
   *
   * If the user gives express permission or the call is otherwise approved, the vended Promise
   * is resolved.
   * The underlying system may choose to allow the user to select specific MIDI interfaces to expose
   * to this API (i.e. pick and choose interfaces on an individual basis),
   * although this is not required.
   *
   * The system may also choose to prompt (or not) based on whether system exclusive support is
   * requested, as system exclusive access has greater privacy and security implications.
   *
   * If the user declines or the call is denied for any other reason, the Promise is rejected with
   * a DOMException parameter.
   *
   * @param {IWebMIDI.IMIDIOptions} [opts]
   * @returns {Promise<IWebMIDI.IMIDIAccess>}
   * @memberof Navigator
   */
  requestMIDIAccess(opts?: IWebMIDI.IMIDIOptions): Promise<IWebMIDI.IMIDIAccess>;
}

declare namespace IWebMIDI {
  type DOMString = string;
  type DOMHighResTimeStamp = number;
  type EventHandler = () => void;
  type MIDIInputMap = Map<DOMString, IMIDIInput>;
  type MIDIOutputMap = Map<DOMString, IMIDIOutput>;

  /**
   * This dictionary contains optional settings that may be provided to requestMIDIAccess.
   *
   * @interface MIDIOptions
   */
  interface IMIDIOptions {

    /**
     * This member informs the system whether the ability to send and receive system exclusive
     * messages is requested or allowed on a given MIDIAccess object.
     *
     * On the option passed to requestMIDIAccess, if this member is set to true, but system
     * exclusive support is denied (either by policy or by user action), the access request will
     * fail with a "SecurityError" error.
     *
     * If this support is not requested (and allowed), the system will throw exceptions if the user
     * tries to send system exclusive messages, and will silently mask out any system exclusive
     * messages received on the port.
     *
     * @type {boolean}
     * @memberof MIDIOptions
     */
    sysex: boolean;

    /**
     * This member informs the system whether the ability to utilize any software synthesizers
     * installed in the host system is requested or allowed on a given MIDIAccess object.
     *
     * On the option passed to requestMIDIAccess, if this member is set to true, but software
     * synthesizer support is denied (either by policy or by user action), the access request will
     * fail with a "SecurityError" error.
     *
     * If this support is not requested, the system should not
     * include any software synthesizers in the MIDIAccess exposure of available ports.
     *
     * @type {boolean}
     * @memberof MIDIOptions
     */
    software: boolean;
  }

  interface IMIDIAccess {
    readonly inputs: MIDIInputMap;
    readonly outputs: MIDIOutputMap;
    readonly sysexEnabled: boolean;
    onstatechange: EventHandler;
  }

  interface IMIDIPort extends EventTarget {
    readonly id: DOMString;
    readonly manufacturer?: DOMString;
    readonly name?: DOMString;
    readonly type: MIDIPortType;
    readonly version?: DOMString;
    readonly state: MIDIPortDeviceState;
    readonly connection: MIDIPortConnectionState;
    onstatechange: EventHandler;

    open(): Promise<IMIDIPort>;
    close(): Promise<IMIDIPort>;
  }

  interface IMIDIInput extends IMIDIPort {
    onmidimessage: EventHandler;
  }

  interface IMIDIOutput extends IMIDIPort {
    send(data: Uint8Array, timestamp?: DOMHighResTimeStamp): void;
    clear(): void;
  }

  enum MIDIPortType {
    input,
    output,
  }

  enum MIDIPortDeviceState {
    disconnected,
    connected,
  }

  enum MIDIPortConnectionState {
    open,
    closed,
    pending,
  }

  class MIDIMessageEvent extends Event {
    public data: Uint8Array;

    constructor(type: DOMString, eventInitDict?: IMIDIMessageEventInit);
  }

  interface IMIDIMessageEventInit extends EventInit {
    data: Uint8Array;
  }

  class MIDIConnectionEvent extends Event {
    public readonly port: IMIDIPort;
    constructor(type: DOMString, eventInitDict?: IMIDIConnectionEventInit);
  }

  interface IMIDIConnectionEventInit extends EventInit {
    port: IMIDIPort;
  }
}
