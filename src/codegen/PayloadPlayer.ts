/* tslint:disable */
/* eslint-disable */
/*
 * Autogenerated by @creditkarma/thrift-typescript v3.7.6
 * DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
*/
import * as thrift from "thrift";
export interface IPayloadPlayerArgs {
    props?: Buffer;
}
export class PayloadPlayer {
    public props?: Buffer;
    constructor(args?: IPayloadPlayerArgs) {
        if (args != null && args.props != null) {
            this.props = args.props;
        }
    }
    public write(output: thrift.TProtocol): void {
        output.writeStructBegin("PayloadPlayer");
        if (this.props != null) {
            output.writeFieldBegin("props", thrift.Thrift.Type.STRING, 2);
            output.writeBinary(this.props);
            output.writeFieldEnd();
        }
        output.writeFieldStop();
        output.writeStructEnd();
        return;
    }
    public static read(input: thrift.TProtocol): PayloadPlayer {
        input.readStructBegin();
        let _args: any = {};
        while (true) {
            const ret: thrift.TField = input.readFieldBegin();
            const fieldType: thrift.Thrift.Type = ret.ftype;
            const fieldId: number = ret.fid;
            if (fieldType === thrift.Thrift.Type.STOP) {
                break;
            }
            switch (fieldId) {
                case 2:
                    if (fieldType === thrift.Thrift.Type.STRING) {
                        const value_1: Buffer = input.readBinary();
                        _args.props = value_1;
                    }
                    else {
                        input.skip(fieldType);
                    }
                    break;
                default: {
                    input.skip(fieldType);
                }
            }
            input.readFieldEnd();
        }
        input.readStructEnd();
        return new PayloadPlayer(_args);
    }
}